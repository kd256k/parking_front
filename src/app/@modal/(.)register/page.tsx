export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Modal from "@/components/Modal";
import RegisterPage from "@/app/register/page";

export default function Page() {
    return (
        <Modal containerClassName=''>
            <RegisterPage />
        </Modal>
    );
}