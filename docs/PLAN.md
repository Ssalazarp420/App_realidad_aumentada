# Plan: AR Furniture (Android, sin Unity)

App de realidad aumentada para Android, publicable en Google Play. Rehace en otro stack la app del
[Curso de Realidad Aumentada con Unity](https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity):

- Elegir un mueble desde un inventario.
- Detectar planos (piso, mesa) y colocar el modelo 3D sobre ellos.
- Seleccionar, mover y rotar los objetos colocados.
- Tomar una foto de la escena con los objetos y compartirla.
- Cargar el catálogo de muebles desde Supabase sin publicar una versión nueva.

Este archivo dice **qué falta hacer**.
**Con qué** se construye está en [ARQUITECTURA](ARQUITECTURA.md); **qué se hizo y cuándo**, en la [BITACORA](BITACORA.md).

---

## 1. Fases (cada una equivale a un capítulo del curso)

Cada fase se trabaja en una rama `feature/fase-N-<nombre>` y termina con algo que se puede probar en el teléfono. Al terminar una fase: marcar sus casillas, escribir la entrada de la bitácora y abrir el PR hacia `develop`.

### Fase 0 — Entorno listo *(cap. 0)*
Dispositivo de pruebas: **Xiaomi Redmi Note 11** (`2201117TL`, Android 13, ARCore certificado).
- [x] Instalar Node LTS (nvm).
- [x] Instalar JDK 17 y el Android SDK en WSL; `ANDROID_HOME` y `PATH` en `~/.bashrc`.
- [ ] Instalar las extensiones de VS Code (recomendadas en `.vscode/extensions.json`).
- [x] Activar Opciones de desarrollador + depuración USB e inalámbrica en el teléfono.
- [x] `adb pair` + `adb connect`; `adb devices` lista el teléfono.
- [x] Confirmar que el teléfono tiene "Servicios de Google Play para RA" instalado.
- [x] `git init` con Gitflow (`main`, `develop`, tags `vX.Y.Z`).
- [x] Repositorio público en GitHub, push y protección de ramas (`develop` por defecto).
- [x] Documentación: `docs/PLAN.md`, `docs/ARQUITECTURA.md`, `docs/BITACORA.md`, `README.md`.

### Fase 1 — Proyecto base con sesión AR *(cap. 1)*
- [ ] `npx create-expo-app@latest` con TypeScript.
- [ ] Instalar `expo-dev-client` y `@reactvision/react-viro`; agregar su *config plugin* en `app.json`.
- [ ] Configurar Android en `app.json`: `package` (ej. `com.ssalazarp420.arfurniture`), permiso `CAMERA`, `minSdkVersion` ≥ 24, ARCore **required**.
- [ ] `npx expo prebuild` + `npx expo run:android`, o bien `eas build --profile development`.
- [ ] Pantalla AR mínima: `ViroARSceneNavigator` + `ViroARScene` con un cubo flotante.
- [ ] Anotar las versiones exactas en ARQUITECTURA §3.

**Listo cuando:** abres la app en el teléfono y ves un cubo en el espacio a través de la cámara.

### Fase 2 — Interfaz *(cap. 2)*
- [ ] Toolbar inferior con botones: abrir inventario, tomar foto, eliminar objeto.
- [ ] `InventoryPanel` con `FlatList` horizontal (scroll solo horizontal, como en el curso).
- [ ] Animación de entrada y salida con Reanimated (reemplaza DOTween).
- [ ] Estados de la app en Zustand: `menu` → `inventory` → `placing` → `editing` (equivale a los eventos del `GameManager`).

### Fase 3 — Detección de planos y nube de puntos *(cap. 3)*
- [ ] Activar la detección de planos horizontales en `ViroARScene` (`anchorDetectionTypes`).
- [ ] Mostrar la nube de puntos (`displayPointCloud`) mientras se escanea.
- [ ] Visualizar los planos detectados (`ViroARPlane` con material semitransparente).
- [ ] Mensaje de ayuda "Mueve el teléfono lentamente" mientras no haya planos (`onTrackingUpdated`).

### Fase 4 — Modelos 3D *(cap. 4)*
- [ ] Crear o conseguir 3-5 muebles (Meshy, Tripo AI, Sketchfab con licencia CC, Poly Pizza).
- [ ] En Blender: escala real (1 unidad = 1 m), pivote en la base y al centro, *apply transforms*; exportar `.glb` (AR) y `.stl`/`.3mf` (impresión). Ver ARQUITECTURA §5.
- [ ] Optimizar los `.glb` con `gltf-transform`.
- [ ] Definir el tipo `CatalogItem { id, name, description, thumbnail, model, printModel?, scale }` y `catalog.local.ts`.
- [ ] `ItemButton`: nombre, imagen y descripción; al tocarlo guarda el item en el store y pasa a `placing`.

### Fase 5 — Posicionar modelos *(cap. 5)*
- [ ] Retícula que sigue al centro de la pantalla sobre el plano (`onCameraARHitTest` → posición del *hit* más cercano de tipo plano).
- [ ] Vista previa del modelo sobre la retícula.
- [ ] Botón "Colocar" que fija el objeto en esa posición y lo agrega a la lista `placedObjects` del store.
- [ ] Soporte para varios objetos en la escena.

### Fase 6 — Seleccionar, mover y rotar *(cap. 6)*
- [ ] Tocar un objeto lo selecciona (`onClick`) y lo marca visualmente (contorno o anillo bajo el modelo).
- [ ] Arrastrar sobre el plano: `onDrag` con `dragType="FixedToPlane"` (o `FixedToWorld`).
- [ ] Rotar con dos dedos: `onRotate` sobre el eje Y.
- [ ] (Opcional) Escalar con `onPinch`, con límites.
- [ ] Eliminar el objeto seleccionado desde la toolbar.

### Fase 7 — Fotos *(cap. 7)*
- [ ] Ocultar la UI y la retícula, y capturar con `arSceneNavigator.takeScreenshot(nombre, guardarEnGaleria)`.
- [ ] Vista previa de la foto con botones Compartir (`expo-sharing`) y Guardar (`expo-media-library`).
- [ ] Pedir los permisos de galería de forma correcta (Android 13+ usa permisos granulares).

### Fase 8 — Contenido en tiempo real *(cap. 8)*
- [x] Backend elegido: **Supabase**.
- [ ] Crear el proyecto en Supabase; tabla `furniture`, buckets `models` y `thumbnails`, políticas RLS de solo lectura pública.
- [ ] Suscribirse a los cambios (Realtime) y actualizar el inventario sin reiniciar la app.
- [ ] Descargar modelos a caché (`expo-file-system`) antes de colocarlos; mostrar progreso.
- [ ] *Fallback* al catálogo local si no hay conexión.
- [ ] (Opcional) Actualizaciones OTA de código JS con EAS Update.

### Fase 9 — Calidad y publicación en Play Store
- [ ] Ícono, *splash screen* y nombre final.
- [ ] Probar en al menos 2 dispositivos y con poca luz; revisar el consumo de memoria con varios modelos.
- [ ] Tests de la lógica del store y del catálogo (`jest`).
- [ ] Crear la cuenta de **Google Play Console** (pago único de USD 25).
- [ ] Redactar una **política de privacidad** (obligatoria por el uso de la cámara) y publicarla en una URL.
- [ ] Rama `release/1.0.0`: `eas build --profile production --platform android` → `.aab` firmado (EAS gestiona el *keystore*; respaldarlo).
- [ ] Ficha de Play: capturas, descripción, clasificación de contenido, formulario de *Data safety*.
- [ ] Prueba cerrada: las cuentas personales nuevas deben tener **12 testers durante 14 días** antes de producción (verificar la regla vigente).
- [ ] Confirmar que `targetSdkVersion` cumple el mínimo que exige Play ese año.
- [ ] `eas submit --platform android`, promover a producción, fusionar en `main` y crear el tag `v1.0.0`.

---

## 2. Correspondencia Unity → este stack

| Unity (curso) | Aquí |
|---|---|
| AR Session + XR Origin | `ViroARSceneNavigator` + `ViroARScene` |
| AR Plane Manager | `anchorDetectionTypes` + `ViroARPlane` / `onAnchorFound` |
| AR Point Cloud Manager | `displayPointCloud` |
| AR Raycast Manager | `onCameraARHitTest` / `performARHitTestWithPoint` |
| Prefab de mueble con pivote | `.glb` con el pivote corregido en Blender + `Viro3DObject` |
| `GameManager` (singleton + eventos) | Store de Zustand |
| `ItemButtonManager` | Componente `ItemButton` |
| DOTween | Reanimated |
| Canvas UI (Legacy/TMP) | Componentes de React Native sobre la vista AR |
| ScreenCapture + NativeShare | `takeScreenshot` + `expo-sharing` |
| Contenido remoto (cap. 8) | Supabase + `expo-file-system` |
| Build Settings Android | `app.json` + `eas.json` |

---

## 3. Riesgos y plan B

| Riesgo | Mitigación |
|---|---|
| Incompatibilidad entre la versión de Viro y la de Expo SDK | Fijar las versiones que el README de Viro declare compatibles; no actualizar Expo sin probar |
| Un bug en Viro bloquea alguna función (gestos, screenshot) | Plan B: reescribir la pantalla AR en Kotlin con **SceneView** |
| Modelos pesados que hacen lenta la app | `gltf-transform optimize`, texturas ≤ 1024 px, descarga bajo demanda |
| STL de impresión > 50 MB (límite por archivo de Supabase gratis) | Comprimir a `.3mf` o `.zip` |
| El puerto de adb inalámbrico cambia / WSL2 no alcanza el teléfono | Reconectar con el puerto nuevo; si falla, usar el modo de red *mirrored* de WSL o builds en EAS |

---

## 4. Ideas futuras (después de la v1.0)

- **Funciones con IA generativa** (Gemini vía Google AI Studio, o Claude): describir automáticamente los muebles del catálogo, o sugerir muebles a partir de una foto del cuarto. Las llamadas irían desde una *Edge Function* de Supabase para que la API key no quede dentro de la app.
- **Generación automática de modelos:** las APIs de Meshy/Tripo desde una *Edge Function* que suba el resultado a Storage y lo registre en `furniture`.
- **Botón "Imprimir en 3D"** en el detalle del mueble, que descargue el `.stl`/`.3mf`.

---

## 5. Referencias

- Curso original (Unity): https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity
- ViroReact: https://github.com/ReactVision/viro · ejemplos: https://github.com/ReactVision/sample-app
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build / Submit: https://docs.expo.dev/build/introduction/ · https://docs.expo.dev/submit/android/
- ARCore, dispositivos compatibles: https://developers.google.com/ar/devices
- Supabase: https://supabase.com/docs
- SceneView (plan B): https://github.com/sceneview/sceneview
- glTF Transform: https://gltf-transform.dev/
