export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Modal from "@/components/Modal";
import LoginPage from "@/app/login/page";

export default function Page() {
    return (
        <Modal containerClassName=''>
            <LoginPage />
        </Modal>
    );
}