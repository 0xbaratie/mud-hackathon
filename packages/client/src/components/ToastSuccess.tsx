import React from 'react';

type ToastSuccessProps = {
  message: string;
};

export const ToastSuccess: React.FC<ToastSuccessProps> = ({ message }) => {
  return (
    <div className="toast mb-6">
      <div className="alert alert-success">
        <span className="text-white">{message}</span>
      </div>
    </div>
  );
};
