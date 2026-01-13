export const dynamic = 'force-dynamic';
export const revalidate = 0;

import CommentPage from "@/app/comment/page";
import Modal from "@/components/Modal";

export default function Page() {
    return (
        <Modal containerClassName="w-full max-w-[85%] px-4">
            <CommentPage />
        </Modal>
    );
}