import React, { Suspense } from 'react';
import Modal from "@/components/Modal";
import LoginPage from '@/app/login/page';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Modal containerClassName=''>
            <LoginPage />
        </Modal>
    );
}