import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MinecraftControl from '../components/MinecraftControl';
import ServerStatus from '../components/ServerStatus';
import MinecraftModelLoader from '../components/MinecraftModelLoader';

const ServerPanel = () => {
  const { serverName } = useParams();
  const navigate = useNavigate();


  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="col-span-12  justify-between items-center p-4">
        <button
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded opacity-50"
        >
          Back to Servers
        </button>

    <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
            <ServerStatus serverName={serverName} />
        </div>
        <div className="col-span-3">
            <MinecraftControl serverName={serverName} />
        </div>
        <MinecraftModelLoader serverName={serverName} />
    </div>

    </div>
  );
};

export default ServerPanel;
