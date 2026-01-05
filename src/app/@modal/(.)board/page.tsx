import Modal from "@/components/Modal";
import BoardPage from '@/app/board/page';
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Modal containerClassName="w-full max-w-[85%] px-4">
            <BoardPage />
        </Modal>
    );
}