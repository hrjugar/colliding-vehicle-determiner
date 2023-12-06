import { useModal } from "../../../globals/hooks";

interface EditVideoModalProps {
  videoPath: string
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ videoPath }) => {
  const { closeModal } = useModal();

  return (
    <div className="fixed w-full h-full flex flex-col rounded-sm gap-2 p-4">
      <p>Text in Edit Video Modal</p>
    </div>
  );
}

export default EditVideoModal;