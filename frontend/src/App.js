import React from 'react';
import MinecraftControl from './components/MinecraftControl';
import ServerStatus from './components/ServerStatus';

function App() {
  return (
    <div className="min-h-screen body-bg items-start grid grid-cols-12 gap-4">
      <div className='col-span-9'>
        <ServerStatus />
      </div>
      <div className='col-span-3'>
        <MinecraftControl />
      </div>
    </div>
  );
}

export default App;