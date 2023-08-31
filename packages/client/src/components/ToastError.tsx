import React, { ReactNode, useContext, useState, createContext } from 'react';

type ToastErrorProps = {
  message: string;
};

export const ToastError: React.FC<ToastErrorProps> = ({ message }) => {
  return (
    <div className="toast mb-6">
      <div className="alert alert-error">
        <span className="text-white">{message}</span>
      </div>
    </div>
  );
};
