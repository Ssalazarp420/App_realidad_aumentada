# Bitácora — AR Furniture

Registro cronológico de cada sesión de trabajo: lo que se hizo, lo que se decidió, los problemas encontrados y lo que sigue.
La entrada más reciente va arriba.

**Plantilla:**

```
## AAAA-MM-DD — Título corto
**Fase:** N · **Rama:** feature/...
### Hecho
### Decisiones
### Problemas y soluciones
### Pendiente
```

---

## 2026-10-18 — Fase 2: interfaz

**Fase:** 2 · **Rama:** `feature/fase-2-interfaz`

### Hecho
- Store de Zustand (`useAppStore`) con los modos `menu` / `inventory` / `placing` / `editing` y el item elegido.
- `Toolbar` inferior (Foto, Inventario, Eliminar), `InventoryPanel` con scroll horizontal animado con Reanimated (deslizamiento + fondo oscurecido), `ItemButton` y `PlacingBanner`.
- Tipos `CatalogItem` / `AppMode` y catálogo local con 6 muebles provisionales.
- Moví los comandos de reconexión del README a una sección "Desarrollo diario".
- `tsc` y `expo lint` pasan. **Probado en el Redmi: la interfaz funciona.** ✅

### Problemas y soluciones
- Errores `Tried to register two views with the same name …` después de instalar Zustand con Metro corriendo. Causa: la actualización HMR de `node_modules`. Solución: reiniciar Metro con `--clear` (ver ARQUITECTURA §6.2.1).
- `pkill -f "expo start"` dentro del mismo comando que lanzaba Metro lo terminó a sí mismo. Detener Metro por separado.

### Observaciones de la prueba
- El cubo de prueba "se mueve" por la pantalla: está a una posición fija respecto al origen de la sesión, no anclado al piso, y el tracking aún no se estabiliza. Se resuelve con la detección de planos (Fase 3) y la colocación por *hit test* (Fase 5). El usuario propuso además ubicar los objetos con un marcador (imagen/QR); ver la entrada siguiente.

### Pendiente
- Fase 3 (planos) y la colocación con marcador.

---

## 2026-10-18 — Fase 1: proyecto base con sesión AR

**Fase:** 1 · **Rama:** `feature/fase-1-proyecto-base`

### Hecho
- Creé el proyecto con la plantilla `default@sdk-57` de Expo (generado en una carpeta temporal y copiado, porque el repo no estaba vacío). Quité las pantallas de ejemplo, el script `reset-project` y los paquetes sin uso (`@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-web-browser`, `expo-device`).
- Instalé `expo-dev-client` y `@reactvision/react-viro` 3.0.3 (versión exacta), con el plugin configurado en `app.json` (`xRMode: ["AR"]`).
- Pantallas: `src/app/index.tsx` (inicio con el botón "Iniciar AR") y `src/app/ar.tsx` (`ViroARSceneNavigator` + botón volver). Escena `src/ar/HelloCubeScene.tsx`: un cubo de 20 cm a 1 m de la cámara y un texto con el estado del tracking.
- Configuré ESLint (`eslint-config-expo`) y `.nvmrc` (Node 24). Conservé `AGENTS.md` y `.claude/settings.json` de la plantilla.
- `tsc`, `expo lint` y `expo-doctor` (21/21) pasan.
- Primer build Android local con `npx expo run:android`: OK. **Probado en el Redmi Note 11: se ve el cubo y "¡AR funcionando!"** ✅

### Decisiones
- D7: Expo SDK 57 en lugar de 58, porque Viro 3.0.3 solo soporta Expo 57 / RN 0.86.
- D8: librerías y CLIs por proyecto (`node_modules`, `npx`); solo Node, JDK y Android SDK van en el sistema. Ver ARQUITECTURA §6.3.
- ARCore queda `optional` (así lo deja Viro). La decisión de `required` se pasa a la Fase 9.

### Problemas y soluciones
- El primer build se cortó a mitad de la compilación C++ porque se cerró la sesión; al relanzarlo retomó desde ahí y terminó en 4 min 33 s.
- MIUI rechazó `adb install` (`INSTALL_FAILED_USER_RESTRICTED`) aun con "Instalar vía USB" activado. Solución: `adb push` del APK a Descargas e instalación manual desde el teléfono (ver ARQUITECTURA §6.2.1).
- Metro corre en WSL: `adb reverse tcp:8081 tcp:8081` + `expo start --dev-client --localhost` hacen que el teléfono lo encuentre por adb, sin pasar por la red de WSL.

### Pendiente
- Fase 2: interfaz (toolbar, inventario horizontal, animaciones con Reanimated, estados con Zustand).

---

## 2026-10-18 — Arranque del proyecto y Fase 0 (entorno)

**Fase:** 0 · **Rama:** `feature/fase-0-entorno`

### Hecho
- Revisé el repo del curso [XRAdventure/Curso-de-Realidad-Aumentada-con-Unity](https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity). Solo tiene README y LICENSE: la referencia son los videos (cap. 0–8) y las notas de configuración.
- Escribí el [PLAN](PLAN.md) con las fases 0–9, cada una equivalente a un capítulo del curso.
- Instalé Node 24 LTS (nvm), JDK 17, el Android SDK (platform-tools, platform 36, build-tools 36), git-flow y GitHub CLI.
- Creé el repo público [Ssalazarp420/App_realidad_aumentada](https://github.com/Ssalazarp420/App_realidad_aumentada) con Gitflow:
  - `main` y `develop` protegidas; `develop` como rama por defecto; tags con prefijo `v`.
- Agregué `.gitignore` para Expo/Android y `.vscode/extensions.json` con las extensiones recomendadas.
- Conecté el Redmi Note 11 (`2201117TL`, Android 13, ARCore 1.57) por depuración inalámbrica de adb.
- Creé `docs/` con PLAN, [ARQUITECTURA](ARQUITECTURA.md) y esta BITÁCORA, más un README en la raíz.

### Decisiones
- D1–D6 (ver [ARQUITECTURA §2](ARQUITECTURA.md#2-decisiones-de-arquitectura)): sin Unity; React Native + Expo + ViroReact; plan B Kotlin + SceneView; Supabase; Gitflow; modelos en dos versiones (AR + impresión 3D).
- Google AI Studio u otro entorno similar: **no** se integra al desarrollo por ahora. Gemini queda como posible función de la app a futuro (ver PLAN, ideas futuras).

### Problemas y soluciones
- `sudo` en WSL pide contraseña, así que los paquetes de sistema (`apt install`) los instala el usuario manualmente.
- Ubuntu no tenía `unzip`, necesario para el Android SDK; se instaló con apt.

### Pendiente
- ~~Instalar las extensiones de VS Code recomendadas.~~ Hecho en la misma sesión.
- ~~Fusionar `feature/fase-0-entorno` en `develop` por PR.~~ Hecho (PR #1).
- ~~Iniciar la Fase 1.~~ Hecho (ver la entrada siguiente).
