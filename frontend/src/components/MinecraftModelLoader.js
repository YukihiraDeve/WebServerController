import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ objUrl, mtlUrl }) => {
  const [object, setObject] = useState();
  const ref = useRef();

  useEffect(() => {
    const loadModel = async () => {
      const mtlLoader = new MTLLoader();
      const objLoader = new OBJLoader();

      mtlLoader.load(mtlUrl, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(objUrl, (obj) => {
          setObject(obj);
        });
      });
    };

    loadModel();
  }, [objUrl, mtlUrl]);

  return object ? <primitive object={object} ref={ref} scale={[1, 1, 1]} /> : null;
};

const MinecraftModelLoader = ({ serverName, worldName = "world" }) => {
  const [objUrl, setObjUrl] = useState(null);
  const [mtlUrl, setMtlUrl] = useState(null);
  const [apiKey, setApiKey] = useState('test');

  useEffect(() => {
    const fetchUrls = async () => {
      const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;

      try {
        const response = await fetch(fetchUrl, { method: 'POST', headers: { 'x-api-key': apiKey } });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setObjUrl(data.objUrl);
        setMtlUrl(data.mtlUrl);
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching files: ' + error.message);
      }
    };

    fetchUrls();
  }, [serverName, worldName]);

  if (!objUrl || !mtlUrl) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <MinecraftModel objUrl={objUrl} mtlUrl={mtlUrl} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default MinecraftModelLoader;
