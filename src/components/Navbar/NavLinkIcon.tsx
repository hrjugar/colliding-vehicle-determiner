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
  const iconSize = 10;

  return (
    <NavLink to={link} title={title} className={`group/${tailwindGroup}`}>
      {({ isActive }) => {
        return (
          <svg
            width="64" 
            height="64" 
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={isActive ? (
              `w-${iconSize} h-${iconSize} text-gray-600 hover:text-gray-700`
            ) : (
              `w-${iconSize} h-${iconSize} text-gray-300 hover:text-gray-400`
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
        );
      }}
    </NavLink>
  )
}