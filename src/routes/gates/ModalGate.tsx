import React, { useContext } from 'react';
import { ModalContext } from '../../contexts/ModalContext';
import { Outlet } from 'react-router-dom';
import { useModal } from '../../globals/hooks';
import { ModalType } from '../../globals/enums';
import DeleteVideoModal from '../../components/Navbar/modals/DeleteVideoModal';

interface ModalGateProps {
  children: React.ReactNode;
}

const ModalGate: React.FC<ModalGateProps> = ({ children }) => {
  const { currentModal, openModal, closeModal } = useModal();
  console.log("Here in modal gate")

  let currentModalElement = null;
  switch (currentModal.type) {
    case ModalType.DeleteVideo:
      currentModalElement = <DeleteVideoModal video={currentModal.props.video} />
      break;
  }
  
  return (
    <>
      {children}
      {currentModal.type !== null ? (
        <div className='fixed w-full h-full flex flex-col justify-center items-center'>
          <div 
            className='fixed w-full h-full bg-black opacity-50'
            onClick={() => closeModal()}
          ></div>
          {currentModalElement}
        </div>
      ) : null}
    </>
  );
};

export default ModalGate;
