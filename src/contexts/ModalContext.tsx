
import { createContext, useState } from 'react';
import { ModalType } from '../globals/enums';

interface ModalProps {
  type: ModalType | null,
  props: any
}

interface ModalContextProps {
  currentModal: ModalProps;
  openModal: (modalType: ModalType, props: any) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<ModalProps>({
    type: null,
    props: {}
  });

  const openModal = (modalType: ModalType, props: any) => {
    setCurrentModal({ type: modalType, props })
  }

  const closeModal = () => {
    setCurrentModal({ type: null, props: {} });
  };

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
