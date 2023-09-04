import { useState, useEffect } from 'react';
import FullScreenModal from './FullScreenModal';
import VoteModal from './VoteModal';
import { PHASE } from '../constants/constants';
import { ToastError } from './ToastError';
import { ToastSuccess } from './ToastSuccess';

interface HackathonPrizesProps {
  hackathonId: string;
  phase: number;
}

const VoteNone = ({ hackathonId, phase }: HackathonPrizesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, success]);

  return (
    <div className="mt-10 w-full mx-auto">
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <VoteModal
          onClose={closeModal}
          hackathonId={hackathonId}
          submitter={'0x0000000000000000000000000000000000000000'}
          setError={setError}
          setSuccess={setSuccess}
        />
      </FullScreenModal>
      {phase === PHASE.VOTING ? (
        <div className="flex justify-center items-center">
          <a onClick={openModal}>
            <button className="mt-4 font-bold pl-10 pr-10 pt-2 pb-2 shadow-xl rounded-lg">
              Not vote any
            </button>
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default VoteNone;
