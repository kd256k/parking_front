"use client";

import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { ModalProvider } from "@/contexts/ModalContext";

export default function Modal({
    children,
    closeable = true,
    showHideButton = false
}: {
    children: React.ReactNode;
    closeable?: boolean;
    showHideButton?: boolean;
}) {
    const router = useRouter();

    return (
        <ModalProvider>
            <div
                className="fixed flex-col inset-0 bg-black/50 z-50 flex items-center justify-center"
                onClick={() => closeable && router.back()} // 배경 클릭 시 닫기
            >
                <div className="min-w-120 max-w-[90%]">
                    {
                        showHideButton &&
                        <div onClick={() => router.back()} className="flex justify-end cursor-pointer -mr-8 text-4xl text-white">
                            <IoCloseOutline />
                        </div>
                    }
                    <div
                        className="bg-white p-6 rounded-lg w-full"
                        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
                    >
                        {children}
                    </div>
                </div>
            </div>
        </ModalProvider>
    );
}
