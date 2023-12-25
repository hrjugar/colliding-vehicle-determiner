import { Tab } from '@headlessui/react';
import React from 'react';

interface IdentifyVehiclesPanelProps {

}

const IdentifyVehiclesPanel: React.FC<IdentifyVehiclesPanelProps> = ({ }) => {

  return (
    <Tab.Panel className="w-full h-full bg-white flex flex-col justify-center items-center">
      <p>Identify Vehicles Panel</p>
    </Tab.Panel>
  );
};

export default IdentifyVehiclesPanel;
