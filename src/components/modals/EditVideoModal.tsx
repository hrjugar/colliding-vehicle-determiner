import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface EditVideoModalProps {
  videoPath: string,
  isOpen: boolean,
  close: any,
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ videoPath, isOpen, close }) => {
  console.log(`EditVideoModal: videoPath = ${videoPath}`)

  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog onClose={() => close()}>
        <div className="fixed inset-0 w-screen flex flex-col items-center justify-end">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/30" onClick={() => close()} />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition linear duration-500 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition linear duration-500 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"          
          >
            <Dialog.Panel className='w-full h-[calc(100%_-_4rem)] flex flex-col'>
              <div className="w-full flex flex-row items-center justify-between pl-4 bg-color-primary">
                <Dialog.Title className="text-base text-gray-100">Edit Video</Dialog.Title>
                <button 
                  className="group/edit-modal-close-btn p-4 bg-transparent hover:bg-white cursor-pointer"
                  onClick={() => close()}
                >
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                  >
                    <path 
                      d="M0 0 L64 64 M64 0 L0 64 Z"
                      className="fill-current stroke-[4] stroke-white group-hover/edit-modal-close-btn:stroke-color-primary"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-white w-full h-full p-4">
                <video muted className="rounded-sm object-contain w-1/2">
                  <source src={`video:///${videoPath}`} type="video/mp4"/>
                </video>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
        {/* <div className="fixed bg-white w-full h-full flex flex-col rounded-sm animate-slide-appear">
          <div className="flex flex-row justify-between items-center px-6 py-4 bg-gray-100 border-b-[1px] border-gray-200">
            <h1 className="text-2xl font-semibold">Edit Video</h1>

            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-600 hover:text-black w-6 h-6 cursor-pointer"
              onClick={() => close()}
            >
              <path 
                d="M35.8933 32L50.6666 46.7734V50.6667H46.7733L32 35.8934L17.2266 50.6667H13.3333V46.7734L28.1066 32L13.3333 17.2267V13.3334H17.2266L32 28.1067L46.7733 13.3334H50.6666V17.2267L35.8933 32Z"
                className="fill-current"
              />
            </svg>
          </div>

          <div className="w-full h-full bg-white">
            <div className="w-full p-4 flex flex-col items-center">
              <video muted className="rounded-md">
                <source src={`video:///${videoPath}`} type="video/mp4"/>
              </video>
            </div>
          </div>
        </div> */}
      </Dialog>
    </Transition>
    // <div className="fixed bg-white w-full h-full flex flex-col rounded-sm animate-slide-appear">
    //   <div className="flex flex-row justify-between items-center px-6 py-4 bg-gray-100 border-b-[1px] border-gray-200">
    //     <h1 className="text-2xl font-semibold">Edit Video</h1>

    //     <svg 
    //       width="64" 
    //       height="64" 
    //       viewBox="0 0 64 64" 
    //       xmlns="http://www.w3.org/2000/svg"
    //       className="text-gray-600 hover:text-black w-6 h-6 cursor-pointer"
    //       onClick={() => closeModal()}
    //     >
    //       <path 
    //         d="M35.8933 32L50.6666 46.7734V50.6667H46.7733L32 35.8934L17.2266 50.6667H13.3333V46.7734L28.1066 32L13.3333 17.2267V13.3334H17.2266L32 28.1067L46.7733 13.3334H50.6666V17.2267L35.8933 32Z"
    //         className="fill-current"
    //       />
    //     </svg>
    //   </div>

    //   <div className="w-full h-full bg-white">
    //     <div className="w-full p-4 flex flex-col items-center">
    //       <video muted className="rounded-md">
    //         <source src={`video:///${videoPath}`} type="video/mp4"/>
    //       </video>
    //     </div>
    //   </div>
    // </div>
  );
}

export default EditVideoModal;