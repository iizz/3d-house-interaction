import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { usePartStore } from '../store/partStore';

export const ThreeCanvas = () => {
  const selectedPart = usePartStore((s) => s.selectedPart);
  const meshMap = useRef<Record<string, THREE.Mesh>>({});
  const originalColors = useRef<Record<string, THREE.Color>>({});
  const meshToGroup = useRef<Record<string, 'Foundation' | 'Wall'>>({});

  useEffect(() => {
    const canvas = document.getElementById(
      'three-canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.set(0, 0, 1100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    loader.load('/models/house.glb', (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center);
      scene.add(gltf.scene);

      gltf.scene.traverse((obj) => {
        if (obj.type === 'Mesh' && obj.name) {
          const mesh = obj as THREE.Mesh;
          meshMap.current[mesh.name] = mesh;
          // 이름 매핑
          if (mesh.name === 'Object002_Object002_mtl_0') {
            meshToGroup.current[mesh.name] = 'Foundation';
          } else {
            meshToGroup.current[mesh.name] = 'Wall';
          }
          // 원래 색상 저장
          if (
            mesh.material &&
            !Array.isArray(mesh.material) &&
            'color' in mesh.material
          ) {
            originalColors.current[mesh.name] = mesh.material.color.clone();
          }
        }
      });

      renderer.render(scene, camera);
    });

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', setSize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      renderer.dispose();
    };
  }, []);

  // 부위 선택 시 색상 변경
  useEffect(() => {
    Object.entries(meshMap.current).forEach(([name, mesh]) => {
      const group = meshToGroup.current[name];
      if (
        mesh.material &&
        !Array.isArray(mesh.material) &&
        'color' in mesh.material
      ) {
        if (selectedPart && group === selectedPart) {
          mesh.material = mesh.material.clone();
          (mesh.material as THREE.MeshStandardMaterial).color.set('orange');
        } else {
          // 원래 색상 복원
          const orig = originalColors.current[name];
          if (orig) {
            mesh.material = mesh.material.clone();
            (mesh.material as THREE.MeshStandardMaterial).color.copy(orig);
          }
        }
      }
    });
  }, [selectedPart]);

  return null;
};
