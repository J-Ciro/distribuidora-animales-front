import React from 'react';
import { Header } from '../header';
import { Footer } from '../footer';
import { ToastContainer } from '../../ui/toast';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

export const MainLayout = ({ children }) => {
  const { toasts } = useToast();

  const handleRemoveToast = (id) => {
    // Toast removal is handled by the toast utility
  };

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content" role="main">
        {children}
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
};

