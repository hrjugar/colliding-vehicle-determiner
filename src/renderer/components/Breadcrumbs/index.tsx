import React from 'react';
import { UIMatch, useMatches, useNavigate } from 'react-router-dom';
import { BreadcrumbsHandle } from './types';
import { getFileNameFromPath } from '@renderer/globals/utils';

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const matches = useMatches() as UIMatch<Video, BreadcrumbsHandle | null>[];
  const crumbName = matches.find((match) => match.handle?.name)!.handle!.name;

  const videoData = matches[matches.length - 1].data;

  console.log(`videoData: ${videoData}`);
  console.log(`crumbName: ${crumbName}`);

  return (
    <div className='flex flex-col justify-start items-start h-20'>
      <h2 className="text-2xl font-semibold">{crumbName}</h2>
      {crumbName === "Videos" ? (
        <div className='flex flex-row items-center gap-2'>
          <p 
            className={`${videoData ? 'cursor-pointer hover:font-medium' : ''}`} 
            onClick={() => {
              if (videoData) {
                navigate('/');
              }
            }}
          >
            Home
          </p>
          {videoData ? (
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
              <p>{getFileNameFromPath(videoData.path)}</p>
            </>
          ): null}
        </div>
      ): null}
    </div>
  );
};

export default Breadcrumbs;
