# Arquitectura — AR Furniture

Qué tecnologías usamos para construir la app, por qué las elegimos y cómo se conectan entre sí.
Cuando se agrega, cambia o quita una tecnología, se actualiza este archivo y se registra en la [BITACORA](BITACORA.md).

Estado de cada elemento: ✅ instalado / en uso · 🕓 planificado · ❌ descartado

---

## 1. Visión general

```mermaid
flowchart LR
    subgraph Telefono["Teléfono Android (ARCore)"]
        UI["UI React Native<br/>(inventario, toolbar)"]
        Store["Estado global<br/>(Zustand)"]
        AR["Escena AR<br/>(ViroReact → ARCore)"]
        Cache["Caché local<br/>(expo-file-system)"]
        UI <--> Store <--> AR
        AR --> Cache
    end
    subgraph Supabase["Supabase (nube)"]
        DB[("Postgres<br/>tabla furniture")]
        RT["Realtime"]
        ST[("Storage<br/>.glb · .stl · miniaturas")]
    end
    subgraph Contenido["Creación de modelos"]
        GEN["Meshy / Tripo AI"] --> BL["Blender"] --> OPT["gltf-transform"]
    end
    Store <-->|supabase-js| DB
    RT -->|cambios del catálogo| Store
    Cache <-->|descarga| ST
    OPT -->|subida| ST
```

---

## 2. Decisiones de arquitectura

| # | Fecha | Decisión | Alternativas | Motivo |
|---|---|---|---|---|
| D1 | 2026-10-18 | No usar Unity; crear una app nativa Android desde VS Code | Unity + AR Foundation | Preferencia del proyecto: trabajar con un stack web/JS y Claude Code |
| D2 | 2026-10-18 | **React Native + Expo + ViroReact** | Flutter (`ar_flutter_plugin`, `arcore_flutter_plus`, `augen`), WebXR | Viro tiene mantenimiento activo y soporte para Expo; ya trae planos, *hit test*, gestos y screenshot. Los plugins AR de Flutter tienen mantenimiento irregular |
| D3 | 2026-10-18 | Plan B: Kotlin + **SceneView** (`arsceneview`) | — | La mejor calidad AR en Android si Viro se queda corto |
| D4 | 2026-10-18 | **Supabase** como backend | Firebase | SQL relacional para el catálogo; Storage gratuito sin tarjeta; funciona igual con `.glb` y `.stl` |
| D5 | 2026-10-18 | **Gitflow** + Conventional Commits + SemVer | Trunk-based | Versionamiento ordenado y versiones claras para Play Store |
| D6 | 2026-10-18 | Cada modelo en dos versiones: `.glb` para AR y `.stl`/`.3mf` para impresión 3D | Un solo archivo | La AR necesita modelos livianos; la impresión necesita alta resolución |

---

## 3. Stack de la app

| Capa | Tecnología | Reemplaza (Unity) | Estado |
|---|---|---|---|
| Framework | React Native (New Architecture) + **Expo** | Proyecto Unity | 🕓 |
| Build de desarrollo | `expo-dev-client` (Viro **no** funciona en Expo Go) | Build & Run | 🕓 |
| Lenguaje | TypeScript | C# | 🕓 |
| AR | `@reactvision/react-viro` → ARCore | AR Foundation + ARCore XR Plugin | 🕓 |
| Navegación | `expo-router` | Escenas | 🕓 |
| Estado global | `zustand` | `GameManager` (singleton) | 🕓 |
| Animaciones UI | `react-native-reanimated` | DOTween | 🕓 |
| Gestos UI 2D | `react-native-gesture-handler` | — | 🕓 |
| Imágenes | `expo-image` | RawImage | 🕓 |
| Compartir foto | `expo-sharing` | NativeShare | 🕓 |
| Guardar foto | `expo-media-library` | — | 🕓 |
| Caché de modelos | `expo-file-system` | — | 🕓 |
| Backend | `@supabase/supabase-js` | Contenido remoto (cap. 8) | 🕓 |
| OTA (opcional) | `expo-updates` / EAS Update | — | 🕓 |
| Tests | `jest` + `@testing-library/react-native` | — | 🕓 |
| Build/Publicación | EAS Build + EAS Submit (`.aab`) | Build Settings Android | 🕓 |

> Las versiones exactas se fijan al crear el proyecto (Fase 1), según la compatibilidad declarada por `@reactvision/react-viro` con el Expo SDK. Se anotarán aquí.

---

## 4. Backend (Supabase)

| Recurso | Uso | Estado |
|---|---|---|
| Tabla `furniture` | Catálogo: `id`, `name`, `description`, `thumbnail_url`, `model_url` (`.glb`), `print_url` (`.stl`/`.3mf`, opcional), `scale`, `active`, `updated_at` | 🕓 |
| Realtime | Avisar a la app cuando cambia el catálogo | 🕓 |
| Bucket `models` | `.glb` (AR) y `.stl`/`.3mf` (impresión) | 🕓 |
| Bucket `thumbnails` | Miniaturas del inventario | 🕓 |
| Edge Functions (futuro) | Automatizar la generación con las APIs de Meshy/Tripo | 🕓 |

**Límites del plan gratuito:** 500 MB de base de datos, 1 GB de Storage, **50 MB por archivo**. El proyecto se pausa tras ~1 semana sin actividad (se reactiva desde el panel).

---

## 5. Flujo de modelos 3D

```
Meshy / Tripo AI ──► Blender (limpieza, escala real en metros, pivote en la base)
                        ├──► .stl / .3mf  alta resolución, sólido y "watertight" ─► impresión 3D
                        └──► .glb  decimado (≤ ~50k triángulos, texturas ≤ 1024 px)
                                 └─► gltf-transform optimize ─► AR (< 5 MB)
```

| Herramienta | Uso | Estado |
|---|---|---|
| Meshy | Generar modelos 3D con IA | 🕓 |
| Tripo AI | Generar modelos 3D con IA | 🕓 |
| Blender (Windows) | Limpieza, escala, pivote, exportación | 🕓 |
| `@gltf-transform/cli` | Optimizar `.glb` | 🕓 |

---

## 6. Entorno de desarrollo

### 6.1 Sistema

| Elemento | Versión / Ubicación | Estado |
|---|---|---|
| Windows + WSL2 | Ubuntu 26.04 LTS | ✅ |
| Node.js | v24.22.0 LTS (vía nvm, `~/.nvm`) | ✅ |
| npm | 11.19.1 | ✅ |
| JDK | OpenJDK 17.0.20 (`JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`) | ✅ |
| Android SDK | `ANDROID_HOME=~/Android/Sdk` | ✅ |
| ├ cmdline-tools | latest | ✅ |
| ├ platform-tools (adb) | 37.0.1 | ✅ |
| ├ platforms | android-36 | ✅ |
| └ build-tools | 36.0.0 | ✅ |
| git | 2.53.0 | ✅ |
| git-flow | 1.12.3 (AVH) | ✅ |
| GitHub CLI (`gh`) | 2.46.0, cuenta `Ssalazarp420` | ✅ |
| `eas-cli` | — | 🕓 |

### 6.2 Dispositivo de pruebas

| Campo | Valor |
|---|---|
| Modelo | Xiaomi Redmi Note 11 (`2201117TL`, `spes_global`) |
| Android | 13 (API 33) |
| ARCore | Servicios de Google Play para RA 1.57 |
| Conexión | Depuración inalámbrica de adb (`adb pair` + `adb connect`) desde WSL2 |

> El puerto de `adb connect` cambia cada vez que se reactiva la depuración inalámbrica. Si `adb devices` aparece vacío, vuelve a conectar con el puerto que muestra el teléfono.

### 6.3 Extensiones de VS Code

Recomendadas en [`.vscode/extensions.json`](../.vscode/extensions.json):

| Extensión | ID |
|---|---|
| WSL | `ms-vscode-remote.remote-wsl` |
| Claude Code | `anthropic.claude-code` |
| Expo Tools | `expo.vscode-expo-tools` |
| React Native Tools | `msjsdiag.vscode-react-native` |
| ESLint | `dbaeumer.vscode-eslint` |
| Prettier | `esbenp.prettier-vscode` |
| glTF Tools | `cesium.gltf-vscode` |
| Error Lens | `usernamehw.errorlens` |

---

## 7. Estructura del proyecto

```
App_realidad_aumentada/
├── app/                    # Rutas (expo-router)                 🕓
│   ├── _layout.tsx
│   ├── index.tsx           # Inicio / menú
│   └── ar.tsx              # Pantalla AR
├── src/                                                         🕓
│   ├── ar/                 # FurnitureScene, PlacedObject, Reticle
│   ├── ui/                 # InventoryPanel, ItemButton, Toolbar
│   ├── state/useAppStore.ts
│   ├── data/               # catalog.local.ts, catalog.remote.ts
│   └── types.ts
├── assets/models/          # .glb locales                        🕓
├── assets/thumbnails/                                           🕓
├── docs/
│   ├── PLAN.md             # Qué falta hacer (fases)              ✅
│   ├── ARQUITECTURA.md     # Este archivo                         ✅
│   └── BITACORA.md         # Registro de sesiones                 ✅
├── .vscode/extensions.json                                      ✅
├── app.json · eas.json     # Config Expo / EAS                    🕓
└── README.md                                                    ✅
```

---

## 8. Versionamiento (Gitflow)

Repositorio: https://github.com/Ssalazarp420/App_realidad_aumentada (público, rama por defecto `develop`)

| Rama | Uso |
|---|---|
| `main` | Solo versiones publicadas; cada merge lleva un tag `vX.Y.Z` |
| `develop` | Integración; siempre debe compilar |
| `feature/<nombre>` | Una por fase o funcionalidad (ej. `feature/fase-3-planos`). Sale de `develop` y vuelve a `develop` por PR |
| `release/<X.Y.Z>` | Preparar una versión para Play (`version` / `versionCode`). Se fusiona en `main` + `develop` |
| `hotfix/<X.Y.Z>` | Arreglo urgente sobre producción. Sale de `main` y se fusiona en `main` + `develop` |

- `main` y `develop` están protegidas: sin push directo, sin force push y sin borrado. Los cambios entran por Pull Request (0 aprobaciones requeridas).
- Las ramas se borran automáticamente al fusionar el PR; *squash merge* desactivado para conservar el historial de Gitflow.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Versiones: [SemVer](https://semver.org/lang/es/); `0.x.y` hasta el primer lanzamiento público, que será `1.0.0`.

---

## 9. Servicios externos

| Servicio | Uso | Estado |
|---|---|---|
| GitHub | Repositorio y PRs | ✅ |
| Expo / EAS | Builds en la nube, firma y envío a Play | 🕓 |
| Supabase | Backend del catálogo | 🕓 |
| Google Play Console | Publicación (pago único de USD 25) | 🕓 |
| Meshy / Tripo AI | Generación de modelos 3D | 🕓 |
