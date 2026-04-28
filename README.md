# ParkMap

ParkMap es una aplicación web responsiva para un solo operador que permite marcar manualmente lugares disponibles dentro de un estacionamiento sobre un plano visual. Las marcas se guardan y sincronizan en Firebase Realtime Database, y se mantienen en la misma posición aunque cambie el tamaño de pantalla.

## Funcionalidades

- Muestra el plano del estacionamiento como imagen principal.
- Permite seleccionar el tipo de espacio: carro chico, mediano o grande.
- Agrega marcas con clic o tap sobre el plano.
- Guarda las coordenadas como porcentaje, no como pixeles.
- Mantiene la posición de las marcas al redimensionar la pantalla.
- Elimina una marca al tocarla.
- Muestra contador total de lugares disponibles.
- Muestra contador por tipo de vehículo.
- Guarda y sincroniza marcas desde Firebase Realtime Database.
- Usa `localStorage` solo para recordar el último tamaño de vehículo seleccionado.
- Incluye un botón para limpiar todas las marcas con confirmación previa.
- Está preparada para desplegarse en Netlify sin backend.

## Tecnologías usadas

- HTML
- CSS
- JavaScript vanilla
- Firebase Realtime Database

## Estructura del proyecto

```text
ParkMap/
├── index.html
├── README.md
├── .github/
│   └── copilot-instructions.md
├── assets/
│   └── ParkingMap.png
├── css/
│   └── styles.css
└── js/
    ├── firebase-config.js
    ├── app.js
    ├── markers.js
    └── ui.js
```

## Cómo ejecutar localmente

1. Coloca el archivo del plano en `assets/ParkingMap.png`.
2. Configura Firebase en `js/firebase-config.js` o expone `window.PARKMAP_FIREBASE_CONFIG` antes de cargar la app.
3. Abre el proyecto en VS Code.
4. Usa una extensión como Live Server o cualquier servidor local estático.
5. Abre `index.html` en el navegador desde ese servidor.

Nota: abrir `index.html` directamente desde el sistema de archivos puede funcionar, pero para evitar restricciones del navegador se recomienda usar un servidor local.

## Cómo desplegar en Netlify

1. Sube el proyecto a un repositorio en Git.
2. Conecta el repositorio en Netlify.
3. Usa la carpeta raíz del proyecto como directorio de publicación.
4. No necesitas comando de build porque el proyecto no usa framework ni bundler.
5. Verifica que `assets/ParkingMap.png` exista en el despliegue final.
6. Configura las credenciales de Firebase en el entorno o en `js/firebase-config.js`.

## Reglas para futuras iteraciones con IA

- Mantener la arquitectura modular: `firebase-config.js`, `app.js`, `markers.js` y `ui.js` deben conservar sus responsabilidades.
- No introducir frameworks ni dependencias externas sin justificación clara, salvo Firebase Realtime Database que es parte de esta versión.
- No mover la lógica visual de contadores y mensajes con la persistencia remota.
- Reutilizar funciones existentes antes de crear otras nuevas.
- Guardar siempre coordenadas porcentuales para que la interfaz siga siendo responsiva.
- Usar `localStorage` solo para preferencias locales como el tamaño de vehículo seleccionado.
- Respetar la estructura visual y los nombres de archivo existentes.
- Si se agrega un archivo nuevo, documentar por qué existe.
- No eliminar comportamiento que ya sea usado por otra parte del sistema.
- Mantener la experiencia rápida para un solo operador.

## Pendientes o mejoras futuras

- Reemplazar el archivo placeholder por el plano real del estacionamiento si todavía no se ha copiado el PNG final.
- Configurar reglas de seguridad de Firebase Realtime Database para el flujo del operador.
- Agregar edición o cambio de tamaño de una marca ya creada.
- Agrupar marcas por zonas del estacionamiento.
- Agregar exportación e importación de marcas.
- Añadir accesibilidad extra para navegación por teclado.
- Registrar métricas simples de uso local si fueran necesarias más adelante.
