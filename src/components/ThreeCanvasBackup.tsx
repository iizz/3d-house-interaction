import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useStepStore } from '../store/useStepStore';

const STEP_PARTS = {
  1: ['Foundation'],
  2: ['Foundation', 'Wall'],
  3: ['Foundation', 'Wall', 'Roof'],
};

export const ThreeCanvas = () => {
  const step = useStepStore((s) => s.step);
  const buildingGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = document.querySelector(
      '#three-canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(2, 2, 4);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 2, 3);
    scene.add(light);

    const material = new THREE.MeshStandardMaterial({
      color: 0x156289,
      flatShading: true,
    });

    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.3, 1),
      material
    );
    foundation.name = 'Foundation';
    foundation.position.y = 0.15;

    const wall = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    wall.name = 'Wall';
    wall.position.y = 0.95;

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.4, 4), material);
    roof.name = 'Roof';
    roof.position.y = 1.7;

    const buildingGroup = new THREE.Group();
    buildingGroup.add(foundation, wall, roof);
    scene.add(buildingGroup);
    buildingGroupRef.current = buildingGroup;

    const initialParts = STEP_PARTS[step as keyof typeof STEP_PARTS] || [];
    buildingGroup.children.forEach((obj) => {
      obj.visible = initialParts.includes(obj.name);
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const group = buildingGroupRef.current;
    if (!group) return;
    const visibleParts = STEP_PARTS[step as keyof typeof STEP_PARTS] || [];
    group.children.forEach((obj) => {
      obj.visible = visibleParts.includes(obj.name);
    });
  }, [step]);

  return null;
};
