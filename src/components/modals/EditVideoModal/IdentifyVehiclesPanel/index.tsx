import { Dialog, Tab } from '@headlessui/react';
import React, { useState } from 'react';

interface IdentifyVehiclesPanelProps {

}

const IdentifyVehiclesPanel: React.FC<IdentifyVehiclesPanelProps> = ({ }) => {
  const [testState, setTestState] = useState<number>(0);

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-center items-center">
      <div className='flex flex-row justify-center items-center gap-6'>
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
          className='w-8 h-8 text-color-primary animate-spin'
        >
          <path 
            d="M32 10.6667V5.33337C28.4981 5.33337 25.0305 6.02313 21.7951 7.36325C18.5598 8.70338 15.62 10.6676 13.1438 13.1439C8.14284 18.1448 5.33333 24.9276 5.33333 32H10.6667C10.6667 26.3421 12.9143 20.9159 16.9151 16.9151C20.9158 12.9143 26.342 10.6667 32 10.6667Z"
            className='fill-current'
          />
        </svg>

        <p>Trimming Video...</p>
        <button onClick={() => setTestState((prevState) => prevState + 1)}>Click Me</button>
        <p>{testState}</p>
      </div>
    
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
