import { RequestHandler } from "express";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        seats_capacity INT NOT NULL DEFAULT 4,
        luggage_capacity INT NOT NULL DEFAULT 2,
        price_from TEXT,
        meta JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        reservation_tag VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        client_email VARCHAR(255),
        origin JSONB,
        destination JSONB,
        date DATE,
        time TEXT,
        return_date DATE,
        return_time TEXT,
        passengers INT,
        children JSONB,
        child_seats JSONB,
        luggage JSONB,
        vehicle_type VARCHAR(50),
        pricing JSONB,
        payment_id INT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
        method VARCHAR(50),
        amount NUMERIC,
        status VARCHAR(50),
        provider_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);

    // ensure some vehicle seeds
    const { rows } = await client.query('SELECT COUNT(*)::int AS c FROM vehicles');
    if (rows[0].c === 0) {
      await client.query(`
        INSERT INTO vehicles (key, name, seats_capacity, luggage_capacity, price_from, meta)
        VALUES
        ('economy','Economy',4,2,'€25', '{"desc":"Sedan cómodo"}'),
        ('comfort','Comfort',4,3,'€35','{"desc":"Sedan premium"}'),
        ('van','Van',8,8,'€65','{"desc":"Furgoneta"}'),
        ('luxury','Luxury',4,2,'€80','{"desc":"Limusina"}')
      `);
    }
  } finally {
    client.release();
  }
}

export const handleCreateBooking: RequestHandler = async (req, res) => {
  try {
    await ensureSchema();
    const client = await pool.connect();
    try {
      const data = req.body as any;
      const reservationTag = data.reservationTag || `r_${Date.now()}`;

      const result = await client.query(
        `INSERT INTO bookings (reservation_tag, status, client_email, origin, destination, date, time, return_date, return_time, passengers, children, child_seats, luggage, vehicle_type, pricing)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [
          reservationTag,
          data.status || 'pending',
          data.clientEmail || data.client_email || null,
          JSON.stringify(data.origin || {}),
          JSON.stringify(data.destination || {}),
          data.date || null,
          data.time || null,
          data.returnDate || null,
          data.returnTime || null,
          data.passengers || null,
          data.children ? JSON.stringify(data.children) : null,
          data.childSeats ? JSON.stringify(data.childSeats) : null,
          data.luggage ? JSON.stringify(data.luggage) : null,
          data.vehicleType || null,
          data.pricing ? JSON.stringify(data.pricing) : null,
        ]
      );

      const booking = result.rows[0];
      return res.json({ success: true, booking });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to create booking:', err);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const handleGetVehicles: RequestHandler = async (_req, res) => {
  try {
    await ensureSchema();
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT key, name, seats_capacity, luggage_capacity, price_from, meta FROM vehicles ORDER BY id');
      return res.json({ vehicles: result.rows });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to get vehicles:', err);
    return res.status(500).json({ error: 'Failed to get vehicles' });
  }
};
