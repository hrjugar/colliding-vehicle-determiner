import WindowButtonGroup from "./WindowButtonGroup";

export default function CustomTitleBar() {
  return (
    <div id="custom-title-bar" className="w-full flex flex-row justify-between gap-4">
      <div className="px-6 py-4">
        <h1 className="text-lg font-medium text-left">Videos</h1>
      </div>

      <WindowButtonGroup />
    </div>
  )
}