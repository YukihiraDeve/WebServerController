import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';



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
        setObject(obj);
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
    <Canvas>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={5} />
        <MinecraftModel objUrl={objUrl} mtlUrl={mtlUrl} texturePath={textureBaseURL} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default MinecraftModelLoader;
