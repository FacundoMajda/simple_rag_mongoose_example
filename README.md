# Ejemplo de RAG con Modelos de IA de GitHub

Este proyecto demuestra la Generación Aumentada por Recuperación (RAG) usando modelos de IA de GitHub con una base de datos de productos.

## Qué Hace

La aplicación:

1. Se conecta a una base de datos MongoDB que contiene información de productos
2. Recupera datos de productos para crear contexto para las respuestas de IA
3. Utiliza modelos de IA de GitHub para generar respuestas humanas a consultas de clientes
4. Simula un asistente de ventas virtual para una tienda en línea

## Cómo Usar

1. **Configuración**:

   ```bash
   npm install
   ```

2. **Configurar**:

   - Crea un Token de Acceso Personal de GitHub (PAT) en [Tokens de Acceso Personal de GitHub](https://github.com/settings/personal-access-tokens/new)
   - Añade tu token al campo `apiKey` en index.js

3. **Ejecutar**:

   ```bash
   npm start
   ```

4. **Ejemplos de Consultas**:
   La aplicación viene con preguntas de ejemplo de clientes ya definidas en index.js.
   Descomenta ejemplos adicionales para probar diferentes escenarios.

## Requisitos

- Node.js
- MongoDB ejecutándose localmente en el puerto predeterminado (27017)
- Token de Acceso Personal de GitHub con los permisos adecuados
