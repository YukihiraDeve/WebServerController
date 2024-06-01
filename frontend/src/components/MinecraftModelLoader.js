import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import JSZip from 'jszip';

const Loader = () => {
  const { progress } = useProgress();
  return ;
};

const MinecraftModel = ({ objContent, mtlContent }) => {
  const [object, setObject] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    if (mtlContent) {
      mtlLoader.parse(mtlContent, '', (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        if (objContent) {
          objLoader.parse(objContent, (obj) => {
            setObject(obj);
          });
        }
      });
    }
  }, [objContent, mtlContent]);

  return object ? <primitive object={object} ref={ref} scale={[1, 1, 1]} /> : null;
};

const MinecraftModelLoader = ({ serverName, worldName = "world" }) => {
  const [objContent, setObjContent] = useState(null);
  const [mtlContent, setMtlContent] = useState(null);
  const [apiKey, setApiKey] = useState('test');

  useEffect(() => {
    const fetchUrl = `http://172.16.173.137:3001/api/minecraft/export/${serverName}/${worldName}`;
    fetch(fetchUrl, {
      method: 'POST',
      headers: { 'x-api-key': apiKey }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.blob();
      })
      .then(blob => JSZip.loadAsync(blob))
      .then(zip => {
        const objFile = zip.file(new RegExp(`\.obj$`, 'i'));
        const mtlFile = zip.file(new RegExp(`\.mtl$`, 'i'));

        if (objFile.length === 0 || mtlFile.length === 0) {
          throw new Error("OBJ or MTL file not found in the zip.");
        }

        return Promise.all([objFile[0].async("string"), mtlFile[0].async("string")]);
      })
      .then(([objData, mtlData]) => {
        setObjContent(objData);
        setMtlContent(mtlData);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error fetching or processing OBJ/MTL files: ' + error.message);
      });
  }, [serverName, worldName, apiKey]);

  if (!objContent || !mtlContent) {
    return <Loader />;
  }

  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <MinecraftModel objContent={objContent} mtlContent={mtlContent} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default MinecraftModelLoader;