import { Menu } from "@headlessui/react";
import useIdentifyVehiclesPanelStore from "./store";
import { useShallow } from "zustand/react/shallow";

const modelOptions: YOLOModel[] = ["yolov8n.pt", "yolov8s.pt", "yolov8m.pt", "yolov8l.pt", "yolov8x.pt"]

interface IdentifyVehiclesModelHandlerProps {
  rerunModel: () => void
}

const IdentifyVehiclesModelHandler: React.FC<IdentifyVehiclesModelHandlerProps> = ({ rerunModel }) => {
  const [
    selectedYOLOModel,
    setSelectedYOLOModel,
  ] = useIdentifyVehiclesPanelStore(
    useShallow((state) => [
      state.selectedYOLOModel,
      state.setSelectedYOLOModel,
    ])
  )
  
  return (
    <div className="card">
      <div className="card-header flex flex-row justify-between items-center">
        <h2>Model</h2>
        <button onClick={rerunModel}>Rerun</button>
      </div>

      <div className="relative">
        <Menu>
          <Menu.Button className='bg-white hover:bg-gray-100 transition-colors rounded-sm text-sm w-full flex flex-row justify-between items-center'>
            <span>{selectedYOLOModel}</span>
            <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 text-color-primary"
          >
            <path 
              d="M19.76 22.88L32 35.12L44.24 22.88L48 26.6667L32 42.6667L16 26.6667L19.76 22.88Z"
              className="fill-current"
            />
          </svg>
          </Menu.Button>

          <Menu.Items className="absolute z-[1] top-[100%] card text-sm w-full">
            {modelOptions.map((model) => (
              <Menu.Item key={`deepsort-model-${model}`}>
                <li 
                  className={`px-4 py-2 list-none transition-all rounded-sm font-medium ${model === selectedYOLOModel ? 'bg-color-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedYOLOModel(model)}
                >
                  {model}
                </li>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default IdentifyVehiclesModelHandler;
