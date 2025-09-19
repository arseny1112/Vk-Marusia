import {  ReactNode, useState, createContext } from "react";



interface ModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  }

interface ModalProviderProps {
    children: ReactNode;  
  }

 export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<ModalProviderProps> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)


    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    
    
    return(
        <ModalContext.Provider value={{isOpen, openModal, closeModal}}>
    {children}
    </ModalContext.Provider>
)
}