import MemberPage from "@/app/member/page";
import Modal from "@/components/Modal";

export default function Page() {
    return (
        <Modal containerClassName="w-full max-w-[85%] px-4">
            <MemberPage />
        </Modal>
    );
}