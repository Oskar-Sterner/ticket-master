import { CreateModal } from "@/components/ui/CreateModal";
import { AuthModal } from "@/components/ui/AuthModal";
import React, { createContext, useContext, useState } from "react";

type ModalType = "create" | "auth" | null;

interface ModalContextType {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <CreateModal isOpen={activeModal === "create"} onClose={closeModal} />
      <AuthModal isOpen={activeModal === "auth"} onClose={closeModal} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
