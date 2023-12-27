import React from 'react';
import { addLeadingZero, convertTimeToObject } from '../../../../globals/utils';
import { toast } from 'react-toastify';
import { SliderMarkerType, SliderMarkersAction, SliderMarkersState } from '..';

interface TrimStartHandleInputProps {
  label: string,
  sliderMarkers: SliderMarkersState,
  sliderMarkersDispatch: React.Dispatch<SliderMarkersAction>,
  sliderMarkerType: SliderMarkerType,
  duration: number
  // Add any props you need for the component here
}

const TrimTimeInput: React.FC<TrimStartHandleInputProps> = ({ 
  label,
  sliderMarkers,
  sliderMarkersDispatch,
  sliderMarkerType,
  duration
}) => {
  const timeObject = convertTimeToObject(sliderMarkers[sliderMarkerType]);
  
  const checkInputValidity = (value: number, timeType: "minutes" | "seconds" | "milliseconds") => {
    let max;
    let newDuration;

    if (timeType === "minutes") {
      max = -1;
      newDuration = value * 60 + timeObject.seconds + timeObject.milliseconds / 100;
    } else if (timeType === "seconds") {
      max = 60;
      newDuration = timeObject.minutes * 60 + value + timeObject.milliseconds / 100;
    } else {
      max = 100;
      newDuration = timeObject.minutes * 60 + timeObject.seconds + value / 100;
    }

    if (isNaN(value) || value < 0 || (max !== -1 && value >= max)) {
      return false;
    }

    if (newDuration > duration) {
      toast.error("Start and end time cannot go beyond the video duration");
      return false;
    }

    return true;
  }

  const handleMinutesOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newMinutes = parseInt((e.target as HTMLInputElement).value);
    const isValid = checkInputValidity(newMinutes, "minutes");

    if (isValid) {
      const newTime = (
        newMinutes * 60 + 
        timeObject.seconds + 
        timeObject.milliseconds / 100
      );

      sliderMarkersDispatch({ 
        type: `SET_DYNAMIC`, 
        payload: {
          type: sliderMarkerType,
          value: newTime
        }
      });
    }
  }

  const handleSecondsOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newSeconds = parseInt((e.target as HTMLInputElement).value);
    const isValid = checkInputValidity(newSeconds, "seconds");

    if (isValid) {
      const newTime = (
        timeObject.minutes * 60 + 
        newSeconds + 
        timeObject.milliseconds / 100
      );

      sliderMarkersDispatch({ 
        type: `SET_DYNAMIC`, 
        payload: {
          type: sliderMarkerType,
          value: newTime
        }
      });
    }
  }
  
  const handleMillisecondsOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newMilliseconds = parseInt((e.target as HTMLInputElement).value);
    console.log(`handleMillisecondsOnChange: newMilliseconds = ${newMilliseconds}`)
    const isValid = checkInputValidity(newMilliseconds, "milliseconds");

    if (isValid) {
      const newTime = (
        timeObject.minutes * 60 + 
        timeObject.seconds + 
        newMilliseconds / 100
      );

      console.log(`handleMillisecondsOnChange: newTime = ${newTime}`)
  
      sliderMarkersDispatch({ 
        type: `SET_DYNAMIC`, 
        payload: {
          type: sliderMarkerType,
          value: newTime
        }
      });
    }
  }

  return (
    <div className="bg-color-primary flex flex-row justify-start items-center px-4 py-2 rounded-lg gap-3">
      <p className="text-xs text-white/80">{label}</p>
      <p className="text-white/80 text-lg font-extralight">|</p>
      <div className="text-white flex flex-row items-center">
        <input 
          type="text" 
          value={addLeadingZero(timeObject.minutes)}
          onChange={handleMinutesOnChange}
          className='w-[2ch] bg-transparent'
          pattern="[0-9]{1,2}"
          
        />
        <p>:</p>
        <input 
          type="text" 
          value={addLeadingZero(timeObject.seconds)}
          onChange={handleSecondsOnChange}
          className='w-[2ch] bg-transparent'
          pattern="[0-9]{1,2}"
        />
        <p>:</p>
        <input 
          type="text" 
          value={addLeadingZero(timeObject.milliseconds)}
          onChange={handleMillisecondsOnChange} 
          className='w-[2ch] bg-transparent'
          pattern="[0-9]{1,2}"
        />
        {/* <p className=" text-white">{convertSecondsAndMillisecondsToString(sliderHandleValues[0])}</p> */}
      </div>
    </div>
  );
};

export default TrimTimeInput;
