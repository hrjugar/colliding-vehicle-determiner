import { SliderItem } from "react-compound-slider";
import { convertSecondsToMinutes } from "../../../../../globals/utils";

interface SliderTickProps {
  tick: SliderItem,
};

const SliderTick: React.FC<SliderTickProps> = ({ tick }) => {
  return (
    <span
      className="absolute z-[5] top-4 h-full text-xs text-gray-400 transform -translate-x-1/2 pointer-events-none select-none flex justify-center items-end"
      style={{
        left: `${tick.percent}%`,
      }}
    >
      {convertSecondsToMinutes(tick.value)}
    </span>
  );
};

export default SliderTick;
