import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MinecraftControl from '../components/MinecraftControl';
import ServerStatus from '../components/ServerStatus';
import MinecraftModelLoader from '../components/MinecraftModelLoader';
import ServerPropertiesEditor from '../components/ServerPropertiesEditor';

const ServerPanel = () => {
  const { serverName } = useParams();
  const navigate = useNavigate();
  const apiKey = 'test'; 

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="mx-20">
      <div className="col-span-12 justify-between items-center p-4">
        <button
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded opacity-50"
        >
          Back to Servers
        </button>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-1">
          <ServerStatus serverName={serverName} section="cpu" />
        </div>
        <div className="col-span-1">
          <ServerStatus serverName={serverName} section="memory" />
        </div>
        <div className="col-span-1">
          <ServerStatus serverName={serverName} section="storage" />
        </div>
        <div className="col-span-1">
          <ServerStatus serverName={serverName} section="players" />
        </div>
        <div className="col-span-1">
          <MinecraftControl serverName={serverName} />
        </div>
        <div className="col-span-3 row-span-2 col-start-1 dark:bg-opacity-50 p-2 drop-shadow-xl bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col justify-center overflow-hidden mx-auto w-full">
          <MinecraftModelLoader serverName={serverName} />
        </div>
        <div className="col-span-2 row-span-2 col-start-4 z-20">
          <ServerPropertiesEditor serverName={serverName} apiKey={apiKey} />
        </div>
      </div>
    </div>
  );
};

export default ServerPanel;
