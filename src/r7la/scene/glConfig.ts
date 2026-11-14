import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const isSoftwareGl: boolean = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

export function applyStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  intensity = 0.75
): () => void {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = intensity;
  roomEnv.dispose();
  pmremGenerator.dispose();

  return () => {
    envTarget.dispose();
    if (scene.environment === envTarget.texture) {
      scene.environment = null;
    }
  };
}
