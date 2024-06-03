import React, { useState } from 'react';

const ServerPropertiesEditor = ({ serverName, apiKey }) => {
  const [properties, setProperties] = useState({
    motd: '',
    allowNether: true,
    levelName: '',
    enableCommandBlock: false,
    gamemode: 'survival',
    maxPlayers: 20,
    pvp: true,
    difficulty: 'easy',
    spawnMonsters: true,
    generateStructures: true,
    viewDistance: 10,
    spawnProtection: 16,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperties((prevProps) => ({
      ...prevProps,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditProperties = async () => {
    try {
      await Promise.all(
        Object.entries(properties).map(async ([key, value]) => {
          const response = await fetch(`http://90.79.8.144:3001/api/minecraft/editServerProperties/${serverName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
            body: JSON.stringify({ key, value }),
          });

          if (!response.ok) {
            console.error('Network response was not ok', response.statusText);
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        })
      );
      alert('Server properties updated successfully');
    } catch (error) {
      console.error('Failed to edit server properties:', error);
      alert('Failed to edit server properties');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Edit Server Properties</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">MOTD</label>
          <input type="text" name="motd" value={properties.motd} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Allow Nether</label>
          <input type="checkbox" name="allowNether" checked={properties.allowNether} onChange={handleChange} className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Level Name</label>
          <input type="text" name="levelName" value={properties.levelName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Enable Command Block</label>
          <input type="checkbox" name="enableCommandBlock" checked={properties.enableCommandBlock} onChange={handleChange} className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Gamemode</label>
          <select name="gamemode" value={properties.gamemode} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
            <option value="survival">Survival</option>
            <option value="creative">Creative</option>
            <option value="adventure">Adventure</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Max Players</label>
          <input type="number" name="maxPlayers" value={properties.maxPlayers} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">PVP</label>
          <input type="checkbox" name="pvp" checked={properties.pvp} onChange={handleChange} className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Difficulty</label>
          <select name="difficulty" value={properties.difficulty} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
            <option value="peaceful">Peaceful</option>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Spawn Monsters</label>
          <input type="checkbox" name="spawnMonsters" checked={properties.spawnMonsters} onChange={handleChange} className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Generate Structures</label>
          <input type="checkbox" name="generateStructures" checked={properties.generateStructures} onChange={handleChange} className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">View Distance</label>
          <input type="number" name="viewDistance" value={properties.viewDistance} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Spawn Protection</label>
          <input type="number" name="spawnProtection" value={properties.spawnProtection} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div className="flex justify-end">
          <button onClick={handleEditProperties} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerPropertiesEditor;
