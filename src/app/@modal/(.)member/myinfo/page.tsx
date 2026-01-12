export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Modal from "@/components/Modal";
import MyInfoPage from "@/app/member/myinfo/page";

export default function Page() {
    return (
        <Modal containerClassName=''>
            <MyInfoPage />
        </Modal>
    );
}