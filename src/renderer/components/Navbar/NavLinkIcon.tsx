import { NavLink, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const isActive = location.pathname.startsWith(link);
  return (
    <NavLink to={link} title={title} className={`w-full`}>
      <div 
        className={`group p-4 flex flex-col justify-center items-center ${isActive ? 'bg-color-primary-active' : 'bg-transparent hover:bg-color-primary-active/10'}`}
      >
        <svg
          width="64" 
          height="64" 
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-8 h-8 ${isActive ? 
            'text-color-primary' : 
            'text-color-primary-inactive '
          }`}
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
      {/* {({ isActive }) => {
        return (
        );
      }} */}
    </NavLink>
  )
}