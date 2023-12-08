import { NavLink } from "react-router-dom";

interface NavLinkIconProps {
  title: string;
  tailwindGroup: string;
  shapesCoordinates: string[];
  link: string;
}
export function NavLinkIcon({
  title,
  tailwindGroup,
  shapesCoordinates,
  link,
}: NavLinkIconProps) {
  const iconSize = 8;

  return (
    <NavLink to={link} title={title} className={`group/${tailwindGroup}`}>
      {({ isActive }) => {
        return (
          <div className={isActive ? (
            `bg-white p-3`
          ) : (
            `p-3`
          )}>
            <svg
              width="64" 
              height="64" 
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className={isActive ? (
                `w-8 h-8 text-color-primary`
              ) : (
                `w-8 h-8 text-color-primary-inactive hover:text-color-primary-active`
              )}
            >
              {shapesCoordinates.map((shapeCoordinates, index) => {
                return (
                  <path 
                    key={`${tailwindGroup}-${index}`}
                    d={shapeCoordinates}
                    className="fill-current"
                  />
                )
              })}
            </svg>
          </div>
        );
      }}
    </NavLink>
  )
}