import { useModal } from "../../../globals/hooks";

interface EditVideoModalProps {
  videoPath: string
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ videoPath }) => {
  const { closeModal } = useModal();
  console.log(`EditVideoModal: videoPath = ${videoPath}`)
  const adjustedVideoPath = videoPath.replace(/\\/g, "/")
  console.log(`EditVideoModal: adjustedVideoPath = ${adjustedVideoPath}`)

  return (
    <div className="fixed bg-white w-full h-full flex flex-col rounded-sm animate-slide-appear">
      <div className="flex flex-row justify-between items-center px-6 py-4 bg-gray-100 border-b-[1px] border-gray-200">
        <h1 className="text-2xl font-semibold">Edit Video</h1>

        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-600 hover:text-black w-6 h-6 cursor-pointer"
          onClick={() => closeModal()}
        >
          <path 
            d="M35.8933 32L50.6666 46.7734V50.6667H46.7733L32 35.8934L17.2266 50.6667H13.3333V46.7734L28.1066 32L13.3333 17.2267V13.3334H17.2266L32 28.1067L46.7733 13.3334H50.6666V17.2267L35.8933 32Z"
            className="fill-current"
          />
        </svg>
      </div>

      <div className="w-full h-full p-4 bg-white">
        <video controls>
          <source src={`video:///${adjustedVideoPath}`} />
        </video>
        <p>Text in Edit Video Modal</p>
        <p>{videoPath}</p>
      </div>
    </div>
  );
}

export default EditVideoModal;