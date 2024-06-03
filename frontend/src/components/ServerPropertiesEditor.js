import React, { useState } from 'react';
import axios from 'axios';

const ServerPropertiesEditor = ({ serverName }) => {
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
        Object.entries(properties).map(([key, value]) =>
          axios.post(`/api/editServerProperties/${serverName}`, { key, value })
        )
      );
      alert('Server properties updated successfully');
    } catch (error) {
      console.error('Failed to edit server properties:', error);
      alert('Failed to edit server properties');
    }
  };

  return (
    <div>
      <h2>Edit Server Properties</h2>
      <div>
        <label>
          MOTD:
          <input type="text" name="motd" value={properties.motd} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Allow Nether:
          <input type="checkbox" name="allowNether" checked={properties.allowNether} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Level Name:
          <input type="text" name="levelName" value={properties.levelName} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Enable Command Block:
          <input type="checkbox" name="enableCommandBlock" checked={properties.enableCommandBlock} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Gamemode:
          <select name="gamemode" value={properties.gamemode} onChange={handleChange}>
            <option value="survival">Survival</option>
            <option value="creative">Creative</option>
            <option value="adventure">Adventure</option>
            <option value="spectator">Spectator</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Max Players:
          <input type="number" name="maxPlayers" value={properties.maxPlayers} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          PVP:
          <input type="checkbox" name="pvp" checked={properties.pvp} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Difficulty:
          <select name="difficulty" value={properties.difficulty} onChange={handleChange}>
            <option value="peaceful">Peaceful</option>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Spawn Monsters:
          <input type="checkbox" name="spawnMonsters" checked={properties.spawnMonsters} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Generate Structures:
          <input type="checkbox" name="generateStructures" checked={properties.generateStructures} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          View Distance:
          <input type="number" name="viewDistance" value={properties.viewDistance} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Spawn Protection:
          <input type="number" name="spawnProtection" value={properties.spawnProtection} onChange={handleChange} />
        </label>
      </div>
      <button onClick={handleEditProperties}>Edit Properties</button>
    </div>
  );
};

export default ServerPropertiesEditor;
