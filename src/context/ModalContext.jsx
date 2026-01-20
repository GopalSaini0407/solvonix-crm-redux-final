import {createContext,useContext,useState} from 'react';
import Modal from "../components/ui/Modal";

const ModalContext = createContext({
    openModal: () => {},
    closeModal: () => {},
  });
  
export const useModal=()=>useContext(ModalContext);

export const ModalProvider=({children})=>{

    const [modal,setModal]=useState({
        open:false,
        title:"",
        content:null,
        size:"md",
    });

    const openModal=({title,content,size="md"})=>{
        setModal({
            open:true,
            title,
            content,
            size,
        });
    };

    const closeModal=()=>{
        setModal({
            open:false,
            title:"",
            content:null,
            size:"md",
        })
    }


    return (
        <ModalContext.Provider value={{ openModal,closeModal}}>
         {children}
         {/* single global model */}

         <Modal
         isOpen={modal.open}
         onClose={closeModal}
         title={modal.title}
         size={modal.size}
         >
            {modal.content}
         </Modal>
        </ModalContext.Provider>
    )
}
