import React from 'react';
import Modal from "@/components/Modal";
import LoginPage from '@/app/login/page';

export default function Page() {
  return (
    <Modal closeable={false} showHideButton={true}>
      <LoginPage />
    </Modal>
  );
}