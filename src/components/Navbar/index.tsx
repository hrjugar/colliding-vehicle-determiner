import InsertVideoButton from "./InsertVideoButton";
import { NavLinkIcon } from "./NavLinkIcon";

export default function Navbar() {
  return (
    <nav className="flex flex-col justify-between bg-color-primary h-screen pb-2 gap-2">
      <div className="flex flex-col items-center ">
        <div className="p-3">
          <InsertVideoButton />
        </div>
        <NavLinkIcon 
          title="Videos"
          tailwindGroup="videos-icon"
          shapesCoordinates={[
            "M10.6666 16H5.33331V53.3333C5.33331 54.7478 5.89522 56.1044 6.89541 57.1046C7.8956 58.1048 9.25216 58.6667 10.6666 58.6667H48V53.3333H10.6666V16ZM53.3333 5.33334H21.3333C19.9188 5.33334 18.5623 5.89525 17.5621 6.89544C16.5619 7.89563 16 9.25219 16 10.6667V42.6667C16 44.0812 16.5619 45.4377 17.5621 46.4379C18.5623 47.4381 19.9188 48 21.3333 48H53.3333C54.7478 48 56.1044 47.4381 57.1045 46.4379C58.1047 45.4377 58.6666 44.0812 58.6666 42.6667V10.6667C58.6666 9.25219 58.1047 7.89563 57.1045 6.89544C56.1044 5.89525 54.7478 5.33334 53.3333 5.33334ZM32 38.6667V14.6667L48 26.6667L32 38.6667Z"
          ]} 
          link={"/"}
        />
        <NavLinkIcon 
          title="Videos"
          tailwindGroup="analysis-icon"
          shapesCoordinates={[
            "M29.3333 5.33337V58.6667C15.7333 57.3334 5.33331 45.8667 5.33331 32C5.33331 18.1334 15.7333 6.66671 29.3333 5.33337ZM34.6666 5.33337V29.3334H58.6666C57.3333 16.5334 47.4666 6.66671 34.6666 5.33337ZM34.6666 34.6667V58.6667C47.2 57.3334 57.3333 47.4667 58.6666 34.6667H34.6666Z"
          ]} 
          link={"/analysis"}
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* {navButton("Dark Mode")} */}
      </div>
    </nav>
  )
}