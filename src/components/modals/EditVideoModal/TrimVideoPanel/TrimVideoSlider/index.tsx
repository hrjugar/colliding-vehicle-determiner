import { useState } from 'react';
import { Slider, Handles, Tracks, Ticks} from 'react-compound-slider';
import SliderStartEndHandle from './SliderStartEndHandle';
import SliderTrack from './SliderTrack';
import SliderTick from './SliderTick';
import SliderCurrentTimeHandle from './SliderCurrentTimeHandle';

const sliderStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '1rem',
  backgroundColor: 'lightgray',
  borderRadius: '0.375rem',
};

interface TrimVideoSliderProps {
  values: number[],
  duration: number,
  handleSliderOnSlideEnd: (newValues: readonly number[]) => void
}

const TrimVideoSlider: React.FC<TrimVideoSliderProps> = ({ values, duration, handleSliderOnSlideEnd }) => {
  return (
    <div className='flex flex-col w-full h-full pt-6 px-6'>
      <Slider
        rootStyle={sliderStyle}
        domain={[0, duration]}
        step={0.01}
        mode={1}
        values={values}
        onSlideEnd={(newValues: readonly number[]) => handleSliderOnSlideEnd(newValues)}
      >
        <Handles>
          {({ handles, getHandleProps }) => (
            <div>
              {handles.map((handle, index) => {
                if (index === 1) {
                  return (
                    <SliderCurrentTimeHandle 
                      key={handle.id}
                      getHandleProps={getHandleProps}
                      handle={handle}
                    />
                  )
                } else {
                  return (
                    <SliderStartEndHandle 
                      key={handle.id}
                      getHandleProps={getHandleProps}
                      handle={handle}
                    />
                  );
                }
              })}
            </div>
          )}
        </Handles>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className='absolute w-full h-full rounded-md overflow-hidden'>
              {tracks.map(({ id, source, target }) => (
                <SliderTrack 
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>

        <Ticks>
          {({ ticks }) => (
            <div>
              {ticks.map((tick) => (
                <SliderTick key={tick.id} tick={tick} />
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
      <div className='w-full h-4'/>
    </div>
  );
}

export default TrimVideoSlider;