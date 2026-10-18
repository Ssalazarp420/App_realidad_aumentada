# Plan: AR Furniture (Android, sin Unity)

App de realidad aumentada para Android, publicable en Google Play. Rehace en otro stack la app del
[Curso de Realidad Aumentada con Unity](https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity):

- Elegir un mueble desde un inventario.
- Detectar planos (piso, mesa) y colocar el modelo 3D sobre ellos.
- Seleccionar, mover y rotar los objetos colocados.
- Tomar una foto de la escena con los objetos y compartirla.
- Cargar el catálogo de muebles desde un servidor sin publicar una versión nueva.

Desarrollo en VS Code con Claude Code, sobre WSL2.

---

## 1. Elección de tecnología

| Opción | AR en Android | Estado del ecosistema | Veredicto |
|---|---|---|---|
| **React Native + Expo + ViroReact** | ARCore vía `@reactvision/react-viro` | Mantenido activamente (ReactVision/Morrow), soporte oficial para Expo con *development build* | **Elegida** |
| Flutter + `ar_flutter_plugin` / `arcore_flutter_plus` / `augen` | ARCore | Plugins con mantenimiento irregular o muy nuevos; poca documentación | Descartada por riesgo |
| Kotlin nativo + SceneView (`arsceneview`) | ARCore + Filament | Muy activo, la mejor calidad en Android | **Plan B** si Viro falla |
| WebXR (web) + TWA | WebXR en Chrome | Limitado, fotos y gestos más difíciles | Descartada |

**Por qué React Native + Expo + Viro:**
- Escribes JavaScript/TypeScript, que se trabaja muy bien en VS Code con Claude Code.
- Viro ya trae casi todo lo que el curso hacía en Unity con AR Foundation: detección de planos, nube de puntos, *hit test*, gestos (drag, rotate, pinch) y captura de pantalla.
- Expo + EAS simplifican mucho la firma, el build `.aab` y la subida a Play Store.

**Limitaciones conocidas:**
- Viro **no funciona en Expo Go**. Hace falta un *development build* (`expo-dev-client`).
- Requiere la *New Architecture* de React Native (activada por defecto en Expo reciente).
- Probar AR exige un **teléfono Android físico compatible con ARCore**: el emulador no sirve para esto ([lista de dispositivos](https://developers.google.com/ar/devices)).

> Las versiones exactas se fijan al crear el proyecto (Fase 0). Verificar la compatibilidad entre la versión de Expo SDK y la de `@reactvision/react-viro` en su README o en sus *releases* antes de instalar.

---

## 2. Herramientas y librerías

### 2.1 Entorno (WSL2)

| Herramienta | Para qué |
|---|---|
| Node.js LTS (vía `nvm`) | Runtime de JS |
| JDK 17 (`openjdk-17-jdk`) | Compilar Android con Gradle |
| Android SDK *command-line tools* + `platform-tools` (adb) + `build-tools` + `platforms;android-<target>` | Builds locales e instalación en el teléfono |
| `eas-cli` (`npm i -g eas-cli`) | Builds en la nube, firma y envío a Play Store |
| Git + repositorio en GitHub | Control de versiones |
| Blender (en Windows) | Ajustar escala/pivote de modelos y exportar `.glb` |

**Conectar el teléfono desde WSL2:** usar **depuración inalámbrica** (Android 11+):
`adb pair <ip>:<puerto>` y luego `adb connect <ip>:<puerto>`. La alternativa es `usbipd-win` para pasar el USB a WSL.

**Alternativa sin SDK local:** compilar con `eas build --profile development --platform android` en la nube e instalar el APK resultante.

### 2.2 Extensiones de VS Code

| Extensión | ID | Uso |
|---|---|---|
| WSL | `ms-vscode-remote.remote-wsl` | Trabajar dentro de WSL |
| Claude Code | `anthropic.claude-code` | Asistente |
| Expo Tools | `expo.vscode-expo-tools` | Autocompletado de `app.json` / `eas.json`, depuración |
| React Native Tools | `msjsdiag.vscode-react-native` | Depurar y ejecutar comandos RN |
| ESLint | `dbaeumer.vscode-eslint` | Linting |
| Prettier | `esbenp.prettier-vscode` | Formato |
| glTF Tools | `cesium.gltf-vscode` | Previsualizar y validar modelos `.glb`/`.gltf` |
| Error Lens (opcional) | `usernamehw.errorlens` | Errores en línea |

### 2.3 Librerías de la app

| Paquete | Reemplaza (Unity) | Uso |
|---|---|---|
| `expo` + `expo-dev-client` | Proyecto Unity | Base y *development build* |
| `@reactvision/react-viro` | AR Foundation + ARCore XR Plugin | Sesión AR, planos, nube de puntos, modelos 3D, gestos, screenshot |
| `typescript` | C# | Tipado |
| `expo-router` | Escenas | Navegación (inicio, AR, ajustes) |
| `zustand` | `GameManager` (singleton) | Estado global: modo actual, item elegido, objeto seleccionado |
| `react-native-reanimated` | DOTween | Animaciones de la UI (abrir y cerrar el inventario) |
| `react-native-gesture-handler` | — | Gestos en la UI 2D |
| `expo-image` | RawImage | Miniaturas del inventario con caché |
| `expo-sharing` | Plugin nativo de compartir | Compartir la foto en redes |
| `expo-media-library` | — | Guardar la foto en la galería |
| `expo-file-system` | — | Caché local de modelos descargados |
| `@supabase/supabase-js` **o** `firebase` | Contenido remoto (cap. 8) | Catálogo en tiempo real + almacenamiento de `.glb` |
| `jest` + `@testing-library/react-native` | — | Tests de lógica y UI |

**Formato de modelos 3D:** `.glb` (glTF binario). Optimizar con `@gltf-transform/cli` (`gltf-transform optimize in.glb out.glb`), con una meta de menos de 5 MB por modelo.

### 2.4 Flujo de modelos (Meshy / Tripo AI / Blender → AR + impresión 3D)

Un mismo objeto se publica en dos versiones:

```
Meshy / Tripo AI ──► Blender (limpieza, escala real en metros, pivote en la base)
                        ├──► .stl / .3mf  alta resolución, sólido y "watertight" ─► impresión 3D
                        └──► .glb  decimado (≤ ~50k triángulos, texturas ≤ 1024 px)
                                 └─► gltf-transform optimize ─► AR (< 5 MB)
```

- Ambos archivos se suben a Supabase Storage. La fila de `furniture` guarda `model_url` (AR) y `print_url` (impresión).
- Límites del plan gratuito de Supabase: 1 GB de Storage y **50 MB por archivo**. Los `.stl` de alta resolución pueden pasar ese límite: en ese caso conviene comprimirlos (`.3mf` o `.zip`).
- A futuro: Meshy y Tripo tienen API, así que una *Edge Function* de Supabase podría generar el modelo y registrarlo en el catálogo automáticamente.

---

## 3. Estructura propuesta del proyecto

```
App_realidad_aumentada/
├── app/                    # Rutas (expo-router)
│   ├── _layout.tsx
│   ├── index.tsx           # Pantalla de inicio / menú
│   └── ar.tsx              # Pantalla AR
├── src/
│   ├── ar/
│   │   ├── FurnitureScene.tsx    # ViroARScene: planos, retícula, objetos
│   │   ├── PlacedObject.tsx      # Viro3DObject con gestos y selección
│   │   └── Reticle.tsx           # Indicador de posición sobre el plano
│   ├── ui/
│   │   ├── InventoryPanel.tsx    # Lista horizontal de muebles
│   │   ├── ItemButton.tsx        # Equivalente a ItemButtonManager
│   │   └── Toolbar.tsx           # Botones: inventario, foto, borrar
│   ├── state/useAppStore.ts      # Zustand (equivale a GameManager)
│   ├── data/
│   │   ├── catalog.local.ts      # Catálogo inicial embebido
│   │   └── catalog.remote.ts     # Supabase/Firebase (fase 8)
│   └── types.ts
├── assets/models/          # .glb locales
├── assets/thumbnails/      # Miniaturas .png/.webp
├── app.json                # Config Expo (permisos, plugin Viro, ARCore)
├── eas.json                # Perfiles de build
└── PLAN.md
```

---

## 3.1 Versionamiento (Gitflow)

Repositorio: `github.com/Ssalazarp420/App_realidad_aumentada`

| Rama | Uso |
|---|---|
| `main` | Solo versiones publicadas. Cada merge lleva un tag `vX.Y.Z` |
| `develop` | Integración; siempre debe compilar |
| `feature/<nombre>` | Una por fase o funcionalidad (ej. `feature/fase-3-planos`). Sale de `develop` y vuelve a `develop` |
| `release/<X.Y.Z>` | Preparar una versión para Play Store (subir `version`/`versionCode`, ajustes finales). Sale de `develop` y se fusiona en `main` + `develop` |
| `hotfix/<X.Y.Z>` | Arreglo urgente sobre producción. Sale de `main` y se fusiona en `main` + `develop` |

- Mensajes de commit con [Conventional Commits](https://www.conventionalcommits.org/es/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Versionado [SemVer](https://semver.org/lang/es/): `0.x.y` mientras no esté en producción y `1.0.0` en el primer lanzamiento público.
- El `versionCode` de Android sube en cada build que se envía a Play.
- Proteger `main` y `develop` en GitHub (no permitir push directo; merge por Pull Request).

---

## 4. Fases (cada una equivale a un capítulo del curso)

Cada fase termina con algo que se puede probar en el teléfono. Marca las casillas al avanzar.

### Fase 0 — Entorno listo *(cap. 0)*
Dispositivo de pruebas: **Xiaomi Redmi Note 11** (en la lista de ARCore certificados).
- [x] Instalar Node LTS (nvm).
- [x] Instalar JDK 17 y el Android SDK en WSL (`~/Android/Sdk`: platform-tools, platform 36, build-tools 36); `ANDROID_HOME` y `PATH` en `~/.bashrc`.
- [ ] Instalar las extensiones de VS Code (sección 2.2; ya recomendadas en `.vscode/extensions.json`).
- [x] Activar Opciones de desarrollador + depuración USB e inalámbrica en el teléfono.
- [ ] `adb pair` + `adb connect`; `adb devices` lista el teléfono.
- [x] Confirmar que el teléfono tiene "Servicios de Google Play para RA" instalado.
- [x] `git init` con Gitflow (`main`, `develop`, tags `vX.Y.Z`).
- [x] Repositorio público en GitHub, push y protección de ramas (`develop` por defecto).

### Fase 1 — Proyecto base con sesión AR *(cap. 1)*
- [ ] `npx create-expo-app@latest . --template` (TypeScript).
- [ ] Instalar `expo-dev-client` y `@reactvision/react-viro`; agregar su *config plugin* en `app.json`.
- [ ] Configurar Android en `app.json`: `package` (ej. `com.tuusuario.arfurniture`), permiso `CAMERA`, `minSdkVersion` 24 o más (ARCore), modo ARCore **required**.
- [ ] `npx expo prebuild` + `npx expo run:android`, o bien `eas build --profile development`.
- [ ] Pantalla AR mínima: `ViroARSceneNavigator` + `ViroARScene` con un cubo flotante.

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
- [ ] Conseguir 3-5 muebles `.glb` (Sketchfab con licencia CC, Poly Pizza, o propios).
- [ ] En Blender: escala real (1 unidad = 1 m), pivote en la base y al centro, *apply transforms*; exportar `.glb`.
- [ ] Optimizar con `gltf-transform`.
- [ ] Definir el tipo `CatalogItem { id, name, description, thumbnail, model, scale }` y `catalog.local.ts`.
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
- [x] Backend elegido: **Supabase** (Postgres + Storage + Realtime, plan gratuito).
- [ ] Tabla `furniture` con los campos de `CatalogItem` (+ `print_url` opcional); bucket `models` para `.glb`/`.stl` y bucket `thumbnails`.
- [ ] Suscribirse a los cambios y actualizar el inventario sin reiniciar la app.
- [ ] Descargar modelos a caché (`expo-file-system`) antes de colocarlos; mostrar progreso.
- [ ] *Fallback* al catálogo local si no hay conexión.
- [ ] (Opcional) Actualizaciones OTA de código JS con `expo-updates` / EAS Update.

### Fase 9 — Calidad y publicación en Play Store
- [ ] Ícono, *splash screen* y nombre final.
- [ ] Probar en al menos 2 dispositivos y con poca luz; revisar el consumo de memoria con varios modelos.
- [ ] Tests de la lógica del store y del catálogo (`jest`).
- [ ] Crear la cuenta de **Google Play Console** (pago único de USD 25).
- [ ] Redactar una **política de privacidad** (obligatoria por el uso de la cámara) y publicarla en una URL.
- [ ] `eas build --profile production --platform android` → `.aab` firmado (EAS gestiona el *keystore*; respaldarlo).
- [ ] Ficha de Play: capturas, descripción, clasificación de contenido, formulario de *Data safety*.
- [ ] Prueba cerrada: las cuentas personales nuevas deben tener **12 testers durante 14 días** antes de producción (verificar la regla vigente).
- [ ] Confirmar que `targetSdkVersion` cumple el mínimo que exige Play ese año.
- [ ] `eas submit --platform android` y luego promover a producción.

---

## 5. Correspondencia Unity → este stack

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
| Contenido remoto (cap. 8) | Supabase/Firebase + `expo-file-system` |
| Build Settings Android | `app.json` + `eas.json` |

---

## 6. Riesgos y plan B

| Riesgo | Mitigación |
|---|---|
| Incompatibilidad entre la versión de Viro y la de Expo SDK | Fijar las versiones que el README de Viro declare compatibles; no actualizar Expo sin probar |
| Un bug en Viro bloquea alguna función (gestos, screenshot) | Plan B: reescribir la pantalla AR en Kotlin con **SceneView** (`io.github.sceneview:arsceneview`), sin cambiar el resto de la app o migrándola entera |
| El teléfono no es compatible con ARCore | Revisar la lista oficial antes de empezar |
| Modelos pesados que hacen lenta la app | `gltf-transform optimize`, texturas de 1024 px como máximo, descarga bajo demanda |
| Problemas de ADB/USB desde WSL2 | Depuración inalámbrica o builds en EAS |

---

## 7. Referencias

- Curso original (Unity): https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity
- ViroReact: https://github.com/ReactVision/viro · ejemplos: https://github.com/ReactVision/sample-app
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build / Submit: https://docs.expo.dev/build/introduction/ · https://docs.expo.dev/submit/android/
- ARCore, dispositivos compatibles: https://developers.google.com/ar/devices
- ARCore en apps (required vs optional): https://developers.google.com/ar/develop/java/enable-arcore
- SceneView (plan B): https://github.com/sceneview/sceneview
- glTF Transform: https://gltf-transform.dev/
