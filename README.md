# AR Furniture

App Android de realidad aumentada para colocar muebles 3D en tu entorno: elige un objeto del inventario, ubícalo sobre el piso o una mesa, muévelo, rótalo y toma una foto para compartirla.

Construida con React Native + Expo + ViroReact (ARCore), con el catálogo en Supabase.

## Documentación

| Documento                                    | Contenido                                     |
| -------------------------------------------- | --------------------------------------------- |
| [docs/PLAN.md](docs/PLAN.md)                 | Fases de desarrollo y tareas                  |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Tecnologías, decisiones, entorno y estructura |
| [docs/BITACORA.md](docs/BITACORA.md)         | Registro de cada sesión de trabajo            |

## Desarrollo diario

Si cierras VS Code o reconectas el teléfono, ejecuta:

```bash
adb connect 192.168.1.47:<puerto nuevo>   # el puerto lo muestra "Depuración inalámbrica" en el teléfono
adb reverse tcp:8081 tcp:8081
npx expo start --dev-client --localhost
```

Detalle del ciclo de desarrollo (cuándo recompilar, solución para MIUI): [ARQUITECTURA §6.2.1](docs/ARQUITECTURA.md).

## Estado

🚧 En desarrollo — Fase 2 completa (interfaz). Siguiente: Fase 3 (planos) y colocación con marcador.

Inspirado en el [Curso de Realidad Aumentada con Unity](https://github.com/XRAdventure/Curso-de-Realidad-Aumentada-con-Unity) de XRAdventure.
