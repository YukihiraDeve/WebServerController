import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ objUrl, mtlUrl }) => {
  // Ensure useLoader is directly within a component rendered by Canvas
  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, loader => {
    loader.setMaterials(materials);
  });

  const ref = useRef();
  return <primitive object={obj} ref={ref} scale={[1, 1, 1]} />;
};

const MinecraftModelLoader = ({ serverName, worldName = "world" }) => {
  const [objUrl, setObjUrl] = useState(null);
  const [mtlUrl, setMtlUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;
    
    fetch(fetchUrl, { method: 'POST', headers: {'x-api-key': 'test' }})
      .then(response => {
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(({ objFile, mtlFile }) => {
        setObjUrl(`http://172.16.173.137:3001${objFile}`);
        setMtlUrl(`http://172.16.173.137:3001${mtlFile}`);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching file paths:', error);
      });
  }, [serverName, worldName]);

  if (loading || !objUrl || !mtlUrl) {
    return;
  }

  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <MinecraftModel objUrl={objUrl} mtlUrl={mtlUrl} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 5]} />
      </Suspense>
    </Canvas>
  );
};

export default MinecraftModelLoader;
