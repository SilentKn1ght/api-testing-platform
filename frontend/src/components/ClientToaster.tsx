'use client';

import { Toaster } from 'react-hot-toast';

export default function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#fff',
        },
      }}
    />
  );
}
