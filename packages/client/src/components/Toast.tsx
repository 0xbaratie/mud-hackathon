import { Transition } from '@headlessui/react';

type ToastProps = {
  toastType: 'success' | 'error' | null;
};

export const Toast: React.FC<ToastProps> = ({ toastType }: ToastProps) => {
  return (
    <Transition
      show={!!toastType}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {toastType === 'success' && (
        <div className="toast mb-6">
          <div className="alert alert-success">
            <span className="text-white">Transaction successed.</span>
          </div>
        </div>
      )}
      {toastType === 'error' && (
        <div className="toast mb-6">
          <div className="alert alert-error">
            <span className="text-white">Transaction failed.</span>
          </div>
        </div>
      )}
    </Transition>
  );
};
