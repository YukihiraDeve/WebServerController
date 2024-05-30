import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html, Sky } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ url }) => {
  const obj = useLoader(OBJLoader, url);
  const ref = useRef();

  return (
    <primitive object={obj} ref={ref} scale={[1, 1, 1]} />
  );
};

const MinecraftModelLoader = ({ serverName, worldName  = "world"}) => {
  const [url, setUrl] = useState(null);
  const [apiKey, setApiKey] = useState('test');

  useEffect(() => {
    const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;
    fetch(fetchUrl, { method: 'POST', headers: {'x-api-key': apiKey }}) 
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setUrl(url);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        alert('Error fetching OBJ file: ' + error.message);
      });
  }, [serverName, worldName]);

  if (!url) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <MinecraftModel url={url} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default MinecraftModelLoader;