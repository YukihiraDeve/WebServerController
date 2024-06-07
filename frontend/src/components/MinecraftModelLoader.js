import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import * as THREE from 'three';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ objUrl, mtlUrl, texturePath }) => {
  const [object, setObject] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.setResourcePath(texturePath);
    mtlLoader.load(mtlUrl, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objUrl, (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material && child.material.name) {
              console.log(`Mesh found: ${child.name}, Material: ${child.material.name}`);
              if (child.material.name.toLowerCase().includes('minecraft_block-torch')) {
                console.log('Potential torch material found:', child.material.name);
                addTorchLights(child);
              }
            }
          }
        });
        setObject(obj);
        torches.forEach(torch => {
       const light = new THREE.PointLight(0xffa500, 1, 10);
          light.position.set(torch.position.x, torch.position.y + 0.5, torch.position.z);
          obj.add(light);
       });
      }, 
      undefined, 
      (error) => {
        console.error('Error loading OBJ:', error);
      });
    }, 
    undefined, 
    (error) => {
      console.error('Error loading MTL:', error);
    });
  }, [objUrl, mtlUrl, texturePath]);

  function addTorchLight(mesh) {
    // Compute the centroid of the mesh by averaging the positions of all vertices
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const centroid = new THREE.Vector3();
    geometry.boundingBox.getCenter(centroid);
    centroid.applyMatrix4(mesh.matrixWorld);

    // Adjust the light height based on your model's scale and coordinate system
    const lightHeight = centroid.y + 0.5; 

    const light = new THREE.PointLight(0xffa500, 1, 10);
    light.position.set(centroid.x, lightHeight, centroid.z);
    mesh.parent.add(light);

    console.log(`Torch light added at (${centroid.x}, ${lightHeight}, ${centroid.z})`);
  }

  return object ? <primitive object={object} ref={ref} scale={[1, 1, 1]} /> : null;
};

const MinecraftModelLoader = ({ serverName, worldName = "world" }) => {
  const [objUrl, setObjUrl] = useState(null);
  const [mtlUrl, setMtlUrl] = useState(null);
  const [apiKey, setApiKey] = useState('test');

  const textureBaseURL = 'http://localhost:3000/';

  useEffect(() => {
    const fetchUrl = `http://90.79.8.144:3001/api/minecraft/export/${serverName}/${worldName}`;
    fetch(fetchUrl, { method: 'POST', headers: { 'x-api-key': apiKey } })
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setObjUrl(url);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
    const fetchMTL = `http://90.79.8.144:3001/api/minecraft/exportMTL/${serverName}/${worldName}`;
    fetch(fetchMTL, { method: 'POST', headers: { 'x-api-key': apiKey } })
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setMtlUrl(url);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [serverName, worldName]);

  if (!objUrl) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas shadows>
      <Suspense fallback={<Loader />}>
        <DayNightCycleLight />
        <MinecraftModel objUrl={objUrl} mtlUrl={mtlUrl} texturePath={textureBaseURL} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

const DayNightCycleLight = () => {
  const sunLightRef = useRef();
  const moonLightRef = useRef();
  const ambientLightRef = useRef();
  const { scene } = useThree();
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((time) => (time + delta) % 24);
    const angle = (time / 24) * Math.PI * 2;

    // Update sun position
    if (sunLightRef.current) {
      sunLightRef.current.position.set(
        90 * Math.cos(angle),
        90 * Math.sin(angle),
        0
      );
      sunLightRef.current.lookAt(0, 0, 0);

      if (Math.sin(angle) > 0) {
        sunLightRef.current.color.setHSL(0.1, 1, 0.5); // Noon
      } else {
        sunLightRef.current.color.setHSL(0.1, 1, 0.25); // Sunset/Sunrise
      }
    }

  
    if (moonLightRef.current) {
      moonLightRef.current.position.set(
        -90 * Math.cos(angle),
        -90 * Math.sin(angle),
        0
      );
      moonLightRef.current.lookAt(0, 0, 0);
    }

    if (ambientLightRef.current) {
      if (Math.sin(angle) > 0) {
  
        ambientLightRef.current.color.setHSL(0.6, 1, 1);
        ambientLightRef.current.intensity = 0.5 + 0.5 * Math.sin(angle);
      } else {
  
        ambientLightRef.current.color.setHSL(0.1, 0.5, 0.5);
        ambientLightRef.current.intensity = 0.3 + 0.4 * Math.cos(angle);
      }
    }
  });

  useEffect(() => {
    if (sunLightRef.current) {
      const sunHelper = new THREE.DirectionalLightHelper(sunLightRef.current);
    //  scene.add(sunHelper);
      return () => scene.remove(sunHelper);
    }
  }, [scene]);

  useEffect(() => {
    if (moonLightRef.current) {
      const moonHelper = new THREE.DirectionalLightHelper(moonLightRef.current);
    //  scene.add(moonHelper);
      return () => scene.remove(moonHelper);
    }
  }, [scene]);

  return (
    <>
      <ambientLight ref={ambientLightRef} />
      <directionalLight
        ref={sunLightRef}
        castShadow
        intensity={1}
        color={0xffa500}
        angle={10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <directionalLight
        ref={moonLightRef}
        castShadow
        intensity={1}
        color={0xaaaaaa}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  );
};

export default MinecraftModelLoader;
