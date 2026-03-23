import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Webinars from './components/Webinars';
import UpcomingSessions from './components/UpcomingSessions';
import Newsletter from './components/Newsletter';
import WhyChoose from './components/WhyChoose';
import Footer from './components/Footer';
import { LoginModal, RegisterModal } from './components/Modals';
import Toast from './components/Toast';

export default function App() {
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((msg) => {
    setModal(null);
    setToast({ visible: true, message: msg });
    window.dispatchEvent(new Event('seniorly_auth'));
  }, []);

  const hideToast = useCallback(() => setToast(t => ({ ...t, visible: false })), []);

  return (
    <>
      <Navbar onLogin={() => setModal('login')} onRegister={() => setModal('register')} />
      <main>
        <Hero onRegister={() => setModal('register')} />
        <Webinars onToast={showToast} />
        <UpcomingSessions onToast={showToast} />
        <Newsletter />
        <WhyChoose />
      </main>
      <Footer />

      {modal === 'login' && (
        <LoginModal onClose={() => setModal(null)} onSwitch={() => setModal('register')} onSuccess={(msg) => showToast(msg)} />
      )}
      {modal === 'register' && (
        <RegisterModal onClose={() => setModal(null)} onSwitch={() => setModal('login')} onSuccess={(msg) => showToast(msg)} />
      )}

      <Toast message={toast.message} visible={toast.visible} onHide={hideToast} />
    </>
  );
}