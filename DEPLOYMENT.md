# Guía de Despliegue en Vercel

## Preparación Completa ✅

La aplicación está completamente preparada para el despliegue en Vercel con las siguientes configuraciones:

### ⚠️ **IMPORTANTE - Problema de Deploy Solucionado**

- ✅ Movido `vite` y herramientas de build a `dependencies` (no `devDependencies`)
- ✅ Vercel ahora puede encontrar e instalar `vite` correctamente
- ✅ Error "vite: command not found" resuelto

### 1. Configuración de Build

- ✅ Scripts de build configurados en `package.json`
- ✅ Configuración de Vite optimizada
- ✅ Build del cliente y servidor funcionando

### 2. Configuración de Vercel

- ✅ `vercel.json` configurado con rutas y funciones serverless
- ✅ Redirecciones para SPA configuradas
- ✅ Variables de entorno configuradas

### 3. API y Backend

- ✅ Funciones serverless en `netlify/functions/api.ts`
- ✅ Express.js configurado para producción
- ✅ Rutas API funcionando: `/api/ping`, `/api/demo`

### 4. Google Maps

- ✅ Variables de entorno configuradas para Google Maps API
- ✅ Loader optimizado para producción

## Pasos para Desplegar

### 1. Desvincular del repositorio anterior

```bash
git remote remove origin
```

### 2. Crear nuevo repositorio en GitHub

1. Crea un nuevo repositorio en GitHub
2. Conecta el proyecto:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_NUEVO_REPO.git
git push -u origin main
```

### 3. ⚠️ **CONFIGURAR GOOGLE MAPS API - REQUERIDO**

**La aplicación no funcionará sin esto:**

1. **Crear API Key**: Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Habilitar APIs**: Maps JavaScript API, Places API, Geocoding API, Directions API
3. **Configurar restricciones**: Añade tus dominios (localhost + Vercel domain)
4. **Ver guía completa**: `GOOGLE_MAPS_SETUP.md`

### 4. Conectar Repositorio a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Selecciona este proyecto

### 5. Configurar Variables de Entorno en Vercel

```bash
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
NODE_ENV=production
```

### 3. Configuración Automática

Vercel detectará automáticamente:

- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist/spa`

### 4. Desplegar

- El despliegue se ejecutará automáticamente
- La aplicación estará disponible en tu dominio de Vercel

## Funcionalidades Listas

### Frontend

- ✅ Página principal con formulario de reserva
- ✅ Navegación completa
- ✅ Selector de idiomas
- ✅ Formulario de reserva funcional
- ✅ Autocompletado de direcciones con Google Maps
- ✅ Selector de hora optimizado
- ✅ Responsive design

### Backend

- ✅ API Express.js funcionando
- ✅ Funciones serverless configuradas
- ✅ Manejo de rutas SPA
- ✅ CORS configurado

### Validaciones del Formulario

El botón "Continuar Reserva" se habilita automáticamente cuando:

- ✅ Se selecciona dirección de origen
- ✅ Se selecciona dirección de destino
- ✅ Se selecciona fecha válida
- ✅ Se selecciona hora

## Próximos Pasos Después del Despliegue

1. **Configurar Google Maps API**:

   - Añadir el dominio de Vercel a las restricciones de la API key
   - Formato: `https://tu-proyecto.vercel.app/*`

2. **Configurar Base de Datos** (opcional):

   - Conectar con Neon, Supabase o PostgreSQL
   - Configurar variables de entorno de base de datos

3. **Configurar Autenticación** (si es necesario):

   - Implementar sistema de login/registro
   - Configurar JWT o sesiones

4. **Monitoreo**:
   - Configurar Sentry para monitoring de errores
   - Analytics con Google Analytics o similar

## Testing Local de Producción

Para probar localmente la build de producción:

```bash
npm run build
npm run start
```

La aplicación estará disponible en http://localhost:3000

## Troubleshooting

### Error: "vite: command not found"

✅ **Solucionado**: Las herramientas de build (`vite`, `typescript`, etc.) ahora están en `dependencies` en lugar de `devDependencies`, por lo que Vercel las instalará correctamente.

### Error: "This page can't load Google Maps correctly"

❌ **Problema común**: Google Maps API no configurada correctamente

**Solución:**

1. Verificar que `VITE_GOOGLE_MAPS_API_KEY` esté configurada
2. Verificar que las APIs estén habilitadas en Google Cloud
3. Verificar restricciones de dominio en la API key
4. Ver guía completa en `GOOGLE_MAPS_SETUP.md`

### Error: "RefererNotAllowedMapError"

❌ **Problema**: El dominio no está autorizado

**Solución:** Añadir el dominio de Vercel a las restricciones de la API key

### Si el build falla

1. Verificar que las variables de entorno estén configuradas
2. Revisar los logs de Vercel para errores específicos
3. Asegurar que la Google Maps API key tenga los dominios correctos

## Soporte

- Documentación de Vercel: https://vercel.com/docs
- Builder.io: [Contactar Soporte](#reach-support)
