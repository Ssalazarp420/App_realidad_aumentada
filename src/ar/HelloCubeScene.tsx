import {
  ViroAmbientLight,
  ViroARScene,
  ViroBox,
  ViroDirectionalLight,
  ViroMaterials,
  ViroText,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { useState } from "react";

ViroMaterials.createMaterials({
  cube: {
    diffuseColor: "#208AEF",
    lightingModel: "PBR",
    roughness: 0.4,
    metalness: 0.1,
  },
});

/**
 * Escena de la Fase 1: comprueba que la sesión AR arranca mostrando
 * un cubo de 20 cm flotando un metro delante de la cámara.
 */
export function HelloCubeScene() {
  const [status, setStatus] = useState("Inicializando AR…");

  const onTrackingUpdated = (state: ViroTrackingStateConstants) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setStatus("¡AR funcionando!");
    } else {
      setStatus("Mueve el teléfono lentamente…");
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ViroAmbientLight color="#ffffff" intensity={300} />
      <ViroDirectionalLight color="#ffffff" direction={[0, -1, -0.5]} />
      <ViroText
        text={status}
        position={[0, 0.25, -1]}
        scale={[0.4, 0.4, 0.4]}
        style={{ fontSize: 30, color: "#ffffff", textAlign: "center" }}
      />
      <ViroBox
        position={[0, 0, -1]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, 45, 0]}
        materials={["cube"]}
      />
    </ViroARScene>
  );
}
