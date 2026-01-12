export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Modal from '@/components/Modal';
import AboutPage from '@/app/about/page';

export default function Page() {
    return (
        <Modal>
            <AboutPage />
        </Modal>
    );
}