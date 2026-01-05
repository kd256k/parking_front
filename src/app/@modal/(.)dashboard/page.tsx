export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import React, { Suspense } from 'react';
import DashboardPage from '@/app/dashboard/page';
import AutoFitScale from "@/components/AutoFitScale";

export default function Page() {
    return (
        <Modal containerClassName='w-full max-w-[85%] px-4'>
            <AutoFitScale>
                <DashboardPage />
            </AutoFitScale>
        </Modal>
    );
}