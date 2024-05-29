import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ url }) => {
  const obj = useLoader(OBJLoader, url);
  const ref = useRef();

  return (
    <primitive object={obj} ref={ref} scale={[0.1, 0.1, 0.1]} />
  );
};

const MinecraftModelLoader = ({ serverName, worldName }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;
    fetch(fetchUrl, { method: 'POST' })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setUrl(url);
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
