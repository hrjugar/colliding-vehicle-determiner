import React from 'react';
import { UIMatch, useMatches, useNavigate } from 'react-router-dom';
import { BreadcrumbsHandle } from './types';

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const matches = useMatches() as UIMatch<unknown, BreadcrumbsHandle>[];
  const currentMatch = matches[matches.length - 1];
  console.log(currentMatch)
  const videoId = currentMatch.params.id;

  return (
    <div className='flex flex-col justify-start items-start h-[88px] '>
      <h2 className="text-2xl font-semibold">{currentMatch.handle.name}</h2>
      {currentMatch.handle.name === "Videos" ? (
        <div className='flex flex-row gap-2'>
          <p 
            className={`${videoId ? 'cursor-pointer hover:font-medium' : ''}`} 
            onClick={() => {
              if (videoId) {
                navigate('/');
              }
            }}
          >
            Home
          </p>
          {videoId ? (
            <>
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-color-primary"
              >
                <path 
                  d="M22.9067 44.2133L35.12 32L22.9067 19.76L26.6667 16L42.6667 32L26.6667 48L22.9067 44.2133Z"
                  className="fill-current"
                />
              </svg>
              <p>{videoId}</p>
            </>
          ): null}
        </div>
      ): null}
    </div>
  );
};

export default Breadcrumbs;
