import React, { useEffect, useState } from 'react';

const ServerStatus = () => {
  const [stats, setStats] = useState({ memory: {}, cpu: [], storage: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/system-stats/stats', {
      headers: {
        'x-api-key': 'test'
      }
    })
    .then(response => response.json())
    .then(data => setStats(data))
    .catch(error => console.error('Error fetching system stats:', error));
  }, []);

  const totalMemory = stats.memory.total || 1;
  const usedMemoryPercent = ((stats.memory.used / totalMemory) * 100).toFixed(2);
  const freeMemoryPercent = ((stats.memory.free / totalMemory) * 100).toFixed(2);

  return (
    <div className="bg-blue-200 bg-opacity-50 rounded-lg p-4 flex flex-col space-y-4 mr-10 mt-10">
      <h1 className="text-2xl font-bold">System Stats</h1>
      <div>
        <h2 className="text-xl">Memory</h2>
        <p>Used: {usedMemoryPercent}%</p>
        <p>Free: {freeMemoryPercent}%</p>
      </div>
      <div>
        <h2 className="text-xl">CPU</h2>
        {stats.cpu.map((cpu, index) => (
          <div key={index}>
            <p>Model: {cpu.model}</p>
            <p>Usage: {(cpu.usage * 100).toFixed(2)}%</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl">Storage</h2>
        <pre>{stats.storage}</pre>
      </div>
    </div>
  );
};

export default ServerStatus;
