#!/usr/bin/env node
const https = require("https");

console.log(
  "🔎 Verificando variables de entorno para Netlify / preproducción...\n",
);

const required = [
  "VITE_GOOGLE_MAPS_API_KEY",
  "SMTP_TRANSPORT",
  "FROM_EMAIL",
  "NODE_ENV",
];

let missing = [];
required.forEach((k) => {
  if (!process.env[k]) missing.push(k);
});

if (missing.length) {
  console.log("⚠️  Variables de entorno faltantes:");
  missing.forEach((m) => console.log(`   - ${m}`));
  console.log(
    "\nPor favor configura estas variables en Netlify (Site → Site settings → Build & deploy → Environment) o en tu entorno local antes de ejecutar la verificación completa.",
  );
} else {
  console.log("✅ Todas las variables de entorno requeridas presentes.");
}

// Verify Google Maps key by calling Geocoding API (lightweight check)
async function verifyGoogleKey(key) {
  return new Promise((resolve) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=Málaga&key=${key}`;
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.status === "OK" || json.status === "ZERO_RESULTS") {
              resolve({ ok: true, status: json.status });
            } else {
              resolve({
                ok: false,
                status: json.status,
                error: json.error_message,
              });
            }
          } catch (err) {
            resolve({ ok: false, error: err.message });
          }
        });
      })
      .on("error", (err) => resolve({ ok: false, error: err.message }));
  });
}

(async () => {
  if (process.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.log("\n🌍 Comprobando Google Maps API Key...");
    const res = await verifyGoogleKey(process.env.VITE_GOOGLE_MAPS_API_KEY);
    if (res.ok) {
      console.log(`✅ Google Maps key válida (status: ${res.status})`);
    } else {
      console.log("❌ Google Maps key inválida o error al verificar:");
      console.log(`   ${res.status || ""} ${res.error || ""}`);
      console.log(
        "   Asegúrate de habilitar Maps JavaScript API y Places API y de añadir restricciones de dominio si procede.",
      );
    }
  } else {
    console.log(
      "\nℹ️ Saltando verificación de Google Maps (no hay VITE_GOOGLE_MAPS_API_KEY)",
    );
  }

  // Try to verify SMTP transport via nodemailer verify (best-effort)
  if (process.env.SMTP_TRANSPORT) {
    console.log(
      "\n✉️ Comprobando conexión SMTP (verify) — esto no enviará emails, solo probará la conexión)...",
    );
    try {
      const nodemailer = require("nodemailer");
      let transport = process.env.SMTP_TRANSPORT;
      try {
        transport = JSON.parse(transport);
      } catch (err) {
        // keep as string
      }
      const transporter = nodemailer.createTransport(transport);
      await transporter.verify();
      console.log("✅ Conexión SMTP verificada correctamente");
    } catch (err) {
      console.log("❌ Error verificando SMTP:");
      console.log(`   ${err && err.message ? err.message : err}`);
      console.log(
        "   Verifica que SMTP_TRANSPORT y FROM_EMAIL sean correctos y que tu proveedor permita conexiones desde Netlify/tu entorno.",
      );
    }
  } else {
    console.log("\nℹ️ Saltando verificación SMTP (no hay SMTP_TRANSPORT)");
  }

  console.log("\n🔚 Verificación completada");
})();
