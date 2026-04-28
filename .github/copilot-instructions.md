# Copilot Instructions for ParkMap

## Propósito

ParkMap debe mantenerse simple, modular y fácil de entender. Es una página web responsiva para un solo operador que marca manualmente lugares disponibles sobre un plano de estacionamiento.

## Qué permite el sistema

- Ver el plano del estacionamiento.
- Marcar lugares disponibles.
- Clasificar marcas por tamaño de vehículo.
- Eliminar marcas cuando el lugar se ocupe.
- Ver contadores de disponibilidad.
- Guardar y sincronizar datos en Firebase Realtime Database.
- Usar `localStorage` solo para preferencias locales.

## Qué no debe incluir esta versión

- Backend propio.
- Base de datos distinta de Firebase Realtime Database.
- Login.
- Perfiles de usuario.
- Frameworks como React, Angular o Vue.
- Dependencias externas sin aprobación explícita.

## Reglas obligatorias antes de crear código nuevo

1. Revisar los archivos existentes.
2. Identificar si ya existe una función, módulo o estructura que resuelva parte del problema.
3. Reutilizar o extender lo existente antes de crear algo nuevo.

## Reglas de arquitectura

- `js/firebase-config.js` inicializa Firebase y expone la base de datos.
- `js/app.js` inicializa y coordina la aplicación.
- `js/markers.js` maneja creación, renderizado, eliminación y gestión de marcas.
- `js/ui.js` maneja botones, contadores, selección de tipo, mensajes y preferencias locales.
- `css/styles.css` maneja diseño visual y responsividad.
- `index.html` contiene la estructura principal.
- No mezclar responsabilidades entre archivos.
- No mover código sin necesidad.
- No cambiar nombres de funciones, variables o archivos sin justificación clara.
- No duplicar funciones ni lógica.

## Reglas de datos

- Las marcas deben guardarse con coordenadas porcentuales, nunca con pixeles.
- Las coordenadas deben calcularse con base en el tamaño visible del contenedor del plano.
- Al redimensionar la pantalla, las marcas deben seguir en el mismo lugar del plano.

Formato esperado de una marca:

```json
{
	"id": "spot_001",
	"x": 42.5,
	"y": 63.8,
	"size": "mediano",
	"createdAt": "2026-04-28T18:30:00.000Z"
}
```

## Reglas de interfaz

- La interfaz debe ser clara, responsiva y usable en celular.
- Debe ser rápida para operación manual.
- Debe evitar elementos innecesarios.
- El operador debe poder seleccionar tipo de vehículo, tocar el plano para agregar marca, tocar una marca para eliminarla y ver contadores actualizados.
- Las marcas deben colocarse sobre el plano con `position: absolute`.

## Criterios de calidad

- Mantener la estructura modular.
- No romper funcionalidades existentes.
- No agregar complejidad innecesaria.
- Respetar el objetivo de una herramienta simple para un solo operador.
- Usar `localStorage` solo para preferencias locales.
- Si se necesita crear un archivo nuevo, debe tener una responsabilidad clara.

## Imagen del plano

- `assets/ParkingMap.png` es la imagen base del plano.
- Si no existe todavía, dejar la referencia preparada y documentarlo en el README.
