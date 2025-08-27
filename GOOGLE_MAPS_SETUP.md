# 🗺️ Google Maps API Setup Guide

## ⚠️ **IMPORTANTE: API Key Required**

La aplicación necesita una clave de API de Google Maps para funcionar correctamente. Sigue estos pasos:

## 📝 **Pasos para configurar Google Maps:**

### 1. **Crear proyecto en Google Cloud Console**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" > "Credentials"

### 2. **Crear API Key**
1. Haz clic en "Create Credentials" > "API Key"
2. Copia la clave generada
3. **¡IMPORTANTE!** Configura restricciones de dominio para seguridad

### 3. **Habilitar APIs necesarias**
Ve a "APIs & Services" > "Library" y habilita:
- ✅ **Maps JavaScript API**
- ✅ **Places API** 
- ✅ **Geocoding API**
- ✅ **Directions API**

### 4. **Configurar restricciones de dominio**
En tu API Key, añade estos dominios:
- `http://localhost:*/*` (para desarrollo)
- `https://localhost:*/*` (para desarrollo)
- `https://TU_DOMINIO_VERCEL.vercel.app/*` (para producción)
- Cualquier otro dominio donde despliegues

### 5. **Configurar en el proyecto**

**Para desarrollo local:**
```bash
# Crea archivo .env en la raíz del proyecto
VITE_GOOGLE_MAPS_API_KEY=tu_clave_aqui
```

**Para Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Añade: `VITE_GOOGLE_MAPS_API_KEY` = `tu_clave_aqui`

## 🔧 **Verificar configuración**

1. Abre el archivo `test-maps.html` en tu navegador
2. Si funciona correctamente, verás un mapa de Málaga
3. Si hay errores, revisa:
   - La clave API esté configurada
   - Los dominios estén en las restricciones
   - Las APIs estén habilitadas

## 💰 **Costos**

Google Maps tiene una cuota gratuita mensual:
- **Maps JavaScript API**: 28,000 cargas de mapa gratis/mes
- **Places API**: $17 por 1000 solicitudes (con $200 de crédito gratis)
- **Geocoding API**: $5 por 1000 solicitudes

Para la mayoría de aplicaciones pequeñas/medianas, la cuota gratuita es suficiente.

## 🚨 **Problemas comunes**

### Error: "This page can't load Google Maps correctly"
- ✅ Verifica que la API key esté configurada
- ✅ Verifica que el dominio esté en las restricciones
- ✅ Verifica que las APIs estén habilitadas

### Error: "RefererNotAllowedMapError"
- ✅ Añade tu dominio a las restricciones de la API key
- ✅ Asegúrate de incluir `https://` o `http://`

### Error: "QuotaExceededError"
- ✅ Has superado tu cuota mensual
- ✅ Revisa el uso en Google Cloud Console
- ✅ Considera añadir billing para aumentar la cuota

## 📞 **Soporte**

Si necesitas ayuda:
1. Revisa [la documentación oficial](https://developers.google.com/maps/documentation)
2. Verifica la configuración paso a paso
3. Usa las herramientas de desarrollador del navegador para ver errores específicos
