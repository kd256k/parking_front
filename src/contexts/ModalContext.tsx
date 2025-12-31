"use client";
import { createContext, useContext } from "react";

const ModalContext = createContext(false);

export const useIsModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => (
    <ModalContext.Provider value={true}>{children}</ModalContext.Provider>
);
