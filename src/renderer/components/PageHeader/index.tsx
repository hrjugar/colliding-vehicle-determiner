import React from 'react';

type PageHeaderProps = {
  title: string;
  breadcrumbs?: React.ReactNode[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs
}) => {
  return (
    <div className='flex flex-col justify-start items-start h-16'>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className='flex flex-row items-center gap-2'>
        {breadcrumbs?.map((crumb, i) => (
          <React.Fragment key={`crumb-${i}`}>
            {crumb}
            {i !== breadcrumbs.length - 1 ? (
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
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;
