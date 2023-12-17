import { GetTrackProps, SliderItem } from "react-compound-slider";

interface SliderTrackProps {
  // Add any props you need for the component
  source: SliderItem,
  target: SliderItem,
  getTrackProps: GetTrackProps,
  disabled?: boolean,
}

const SliderTrack: React.FC<SliderTrackProps> = ({ source, target }) => {  
  return (
    <div
      className="absolute z-[1] h-full bg-color-primary"
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      >
    </div>
  );
};

export default SliderTrack;
