import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

interface IdentifyVehiclesPanelProps {
  selectedTabIndex: number,
}

const IdentifyVehiclesPanel: React.FC<IdentifyVehiclesPanelProps> = ({ selectedTabIndex }) => {
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTabIndex === 2) {
      // RUN DEEPSORT HERE
    }
  }, [selectedTabIndex])

  return (
    <Tab.Panel className="w-full h-full bg-white p-4 flex flex-col justify-start items-start">
      <div className='card'>
        <div className='card-header'>
          <h2>Detected Objects</h2>
        </div>

        <div className='px-4 py-2 flex flex-col gap-2'>
          <div className='flex flex-row items-center gap-2'>
            <div className='w-3 h-3 bg-yellow-500'></div>
            <p>Object 1</p>
            <span className='text-xs text-gray-500'>Car</span>
          </div>

          <div className='flex flex-row items-center gap-2'>
            <div className='w-3 h-3 bg-red-500'></div>
            <p>Object 2</p>
            <span className='text-xs text-gray-500'>Car</span>
          </div>

          <div className='flex flex-row items-center gap-2'>
            <div className='w-3 h-3 bg-orange-500'></div>
            <p>Object 3</p>
            <span className='text-xs text-gray-500'>Car</span>
          </div>
        </div>
      </div>
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
