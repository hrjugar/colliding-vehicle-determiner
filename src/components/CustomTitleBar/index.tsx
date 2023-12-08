import WindowButtonGroup from "./WindowButtonGroup";

export default function CustomTitleBar() {
  return (
    <div id="custom-title-bar" className="w-full flex flex-row justify-between gap-4">
      <div>
      </div>

      <WindowButtonGroup />
    </div>
  )
}