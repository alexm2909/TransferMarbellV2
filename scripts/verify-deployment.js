#!/usr/bin/env node

console.log('🔍 Verificando preparación para despliegue en Vercel...\n');

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];
let success = [];

// Verificar archivos esenciales
const requiredFiles = [
  'vercel.json',
  'package.json',
  'vite.config.ts',
  'vite.config.server.ts',
  'netlify/functions/api.ts',
  'server/index.ts',
  'client/App.tsx'
];

console.log('📁 Verificando archivos esenciales...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    success.push(`✅ ${file} encontrado`);
  } else {
    errors.push(`❌ Archivo faltante: ${file}`);
  }
});

// Verificar package.json scripts
console.log('\n🔧 Verificando scripts de build...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = ['build', 'build:client', 'build:server', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      success.push(`✅ Script '${script}' configurado`);
    } else {
      errors.push(`❌ Script faltante: ${script}`);
    }
  });
} catch (error) {
  errors.push('❌ Error leyendo package.json');
}

// Verificar vercel.json
console.log('\n⚙️ Verificando configuración de Vercel...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.buildCommand) {
    success.push('✅ Build command configurado');
  } else {
    warnings.push('⚠️ Build command no especificado en vercel.json');
  }
  
  if (vercelConfig.outputDirectory) {
    success.push('✅ Output directory configurado');
  } else {
    warnings.push('⚠️ Output directory no especificado');
  }
  
  if (vercelConfig.routes && vercelConfig.routes.length > 0) {
    success.push('✅ Rutas configuradas');
  } else {
    warnings.push('⚠️ No se encontraron rutas configuradas');
  }
} catch (error) {
  errors.push('❌ Error leyendo vercel.json');
}

// Verificar que el directorio de build existe después de build
console.log('\n🏗️ Verificando directorios de build...');
if (fs.existsSync('dist/spa')) {
  success.push('✅ Directorio dist/spa existe (ejecutar npm run build si está vacío)');
} else {
  warnings.push('⚠️ Directorio dist/spa no existe - ejecutar npm run build');
}

if (fs.existsSync('dist/server')) {
  success.push('✅ Directorio dist/server existe');
} else {
  warnings.push('⚠️ Directorio dist/server no existe - ejecutar npm run build');
}

// Verificar variables de entorno
console.log('\n🔐 Verificando configuración de variables de entorno...');
if (fs.existsSync('.env.example')) {
  success.push('✅ Archivo .env.example creado como template');
} else {
  warnings.push('⚠️ .env.example no encontrado');
}

// Mostrar resultados
console.log('\n📊 RESUMEN DE VERIFICACIÓN:\n');

if (success.length > 0) {
  console.log('🟢 CONFIGURACIONES CORRECTAS:');
  success.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('🟡 ADVERTENCIAS:');
  warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('🔴 ERRORES QUE DEBEN CORREGIRSE:');
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

// Resultado final
if (errors.length === 0) {
  console.log('🎉 ¡LISTO PARA DESPLEGAR EN VERCEL!');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('   1. Commit y push al repositorio');
  console.log('   2. Conectar repositorio en vercel.com');
  console.log('   3. Configurar variables de entorno en Vercel');
  console.log('   4. Desplegar automáticamente');
  console.log('');
  console.log('📖 Ver DEPLOYMENT.md para instrucciones detalladas');
} else {
  console.log('❌ Hay errores que corregir antes del despliegue');
  console.log('   Revisa los errores arriba y corrígelos');
}

console.log('\n✨ Verificación completada\n');
