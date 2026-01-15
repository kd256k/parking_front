export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Modal from '@/components/Modal';
import DashboardPage from '@/app/dashboard/page';
import AutoFitScale from "@/components/AutoFitScale";

export default function Page() {
    return (
        <Modal containerClassName='w-full max-w-[85%] px-4'>
            <DashboardPage />
        </Modal>
    );
}