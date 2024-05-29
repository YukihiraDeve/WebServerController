import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import JSZip from 'jszip';

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const MinecraftModel = ({ objUrl, mtlUrl }) => {
  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, loader => {
    loader.setMaterials(materials);
  });
  const ref = useRef();

  return (
    <primitive object={obj} ref={ref} scale={[1, 1, 1]} />
  );
};

const MinecraftModelLoader = ({ serverName, worldName = "world" }) => {
  const [objUrl, setObjUrl] = useState(null);
  const [mtlUrl, setMtlUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;
    fetch(fetchUrl, { method: 'POST', headers: {'x-api-key': 'test' }})
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok', response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.blob();
      })
      .then((blob) => {
        const zip = new JSZip();
        return zip.loadAsync(blob);
      })
      .then((zip) => {
        const objFile = Object.keys(zip.files).find((filename) => filename.endsWith('.obj'));
        const mtlFile = Object.keys(zip.files).find((filename) => filename.endsWith('.mtl'));

        if (objFile && mtlFile) {
          // Process OBJ file
          return Promise.all([
            zip.file(objFile).async("blob").then(blob => URL.createObjectURL(blob)),
            zip.file(mtlFile).async("blob").then(blob => URL.createObjectURL(blob))
          ]);
        } else {
          throw new Error('OBJ or MTL file not found in the zip');
        }
      })
      .then(([objUrl, mtlUrl]) => {
        setObjUrl(objUrl);
        setMtlUrl(mtlUrl);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error processing zip file:', error);
      });
  }, [serverName, worldName]);

  if (loading || !objUrl || !mtlUrl) {
    return <Loader />;
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