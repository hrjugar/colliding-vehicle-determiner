import { GetTrackProps, SliderItem } from "react-compound-slider";

interface TrimVideoSliderTrackProps {
  // Add any props you need for the component
  source: SliderItem,
  target: SliderItem,
  getTrackProps: GetTrackProps,
  disabled?: boolean,
}

const TrimVideoSliderTrack: React.FC<TrimVideoSliderTrackProps> = ({ source, target, getTrackProps }) => {  
  return (
    <div
      className="absolute z-[1] h-full bg-color-primary"
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
      >
    </div>
  );
};

export default TrimVideoSliderTrack;
