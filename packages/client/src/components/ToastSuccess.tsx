import React, { ReactNode, useContext, useState, createContext } from 'react';

export const ToastSuccess = () => {
  return (
    <div className="toast">
      <div className="alert alert-success">
        <span className="text-white">Your project submit successfully.</span>
      </div>
    </div>
  );
};
