"use client";

import { IoCloseOutline } from "react-icons/io5";
import { ModalProvider, useModalRouter } from "@/utils/ModalUtil";

export default function Modal({
    children,
    closeable = true,
    showHideButton = false,
    containerClassName = "min-w-120 max-w-[80%]" 
}: {
    children: React.ReactNode;
    closeable?: boolean;
    showHideButton?: boolean;
    containerClassName?: string;
}) {

    const { push, close, currentDepth } = useModalRouter();

    const closeModal = () => {
        close();
    }

    return (
        <ModalProvider>
            <div
                className="fixed inset-0 z-50  bg-black/50 flex items-center justify-center"
                onClick={() => closeable && closeModal()} // 배경 클릭 시 닫기
            >
                <div className={containerClassName}>
                    {
                        showHideButton &&
                        <div onClick={() => closeModal()} className="flex justify-end cursor-pointer -mr-8 text-4xl text-white">
                            <IoCloseOutline />
                        </div>
                    }
                    <div
                        className="w-full"
                        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
                    >
                        {children}
                    </div>
                </div>
            </div>
        </ModalProvider>
    );
}
