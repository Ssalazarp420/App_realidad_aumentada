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
- Fusionar `feature/fase-0-entorno` en `develop` por PR.
- Iniciar la Fase 1: crear el proyecto Expo, instalar Viro y mostrar un cubo en AR.
