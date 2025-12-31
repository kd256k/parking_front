import Modal from '@/components/Modal';
import React from 'react';
import DashboardPage from '@/app/dashboard/page';

export default function Page() {
    return (
        <Modal>
            <DashboardPage />
        </Modal>
    );
}