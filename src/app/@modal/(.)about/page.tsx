import Modal from '@/components/Modal';
import React, { Suspense } from 'react';
import AboutPage from '@/app/about/page';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Modal>
            <AboutPage />
        </Modal>
    );
}