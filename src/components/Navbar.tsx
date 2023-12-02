import { NavLink } from "react-router-dom";
import InsertVideoButton from "./InsertVideoButton";


export default function Navbar() {
  const navButton = (tooltip: string, link?: string) => {
    const navButtonClasses = "w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 hover:cursor-pointer";
    const activeNavButtonClasses = "bg-gray-600 hover:bg-gray-700";

    if (link) {
      return (
        <NavLink 
          to={link}
          title={tooltip}
          className={({ isActive }) => {
            return isActive ?
              `${navButtonClasses} ${activeNavButtonClasses}` :
              `${navButtonClasses}`
          }}
        />
      );
    } else {
      return (
        <div className={navButtonClasses} title="Dark Mode"></div>
      );
    }
  }

  return (
    <nav className="flex flex-col justify-between bg-white h-screen py-5 px-4 gap-4">
      <div className="flex flex-col gap-4">
        <InsertVideoButton />
        {navButton("Videos", "/")}
        {navButton("Analysis", "/analysis")}
      </div>

      <div className="flex flex-col gap-4">
        {navButton("Dark Mode")}
      </div>
    </nav>
  )
}