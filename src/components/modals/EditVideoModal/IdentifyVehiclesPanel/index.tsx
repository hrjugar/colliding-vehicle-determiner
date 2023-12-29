import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
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
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-center items-center">
      <p>Identify Vehicles Panel</p>
      {isLoadingDone ? (
        <p>Done loading</p>
      ) : (
        <p>Not yet done loading</p>
      )}
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
