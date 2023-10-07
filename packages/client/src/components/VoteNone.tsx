import { useState, useEffect } from 'react';
import FullScreenModal from './FullScreenModal';
import VoteModal from './VoteModal';
import { PHASE } from '../constants/constants';
import { ToastError } from './ToastError';
import { ToastSuccess } from './ToastSuccess';
import { useMUD } from '../MUDContext';

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
  const [votesNum, setVotesNum] = useState<Record<string, number>>({});
  const [votes, setVotes] = useState(0);

  const nonSubmitter = "0x0000000000000000000000000000000000000000"

  const {
    network: { worldContract },
  } = useMUD();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);

    setVotesNum((prevVotes) => ({
      ...prevVotes,
      '0x0000000000000000000000000000000000000000': 1,
    }));

    return () => {
      clearTimeout(timer);
    };
  }, [error, success]);

  useEffect(() => {
    (async () => {
      const submittion = await worldContract.getSubmission(hackathonId, nonSubmitter);
      setVotes(submittion.votes.toNumber());
      console.log('@@@submittion: ', votes);
    })();
  }, []);

  return (
    <div className="mt-1 w-full mx-auto">
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <VoteModal
          onClose={closeModal}
          hackathonId={hackathonId}
          votesNum={votesNum}
          setError={setError}
          setSuccess={setSuccess}
          displayNum={false}
        />
      </FullScreenModal>
      {phase === PHASE.VOTING ? (
        <div className="flex justify-center items-center">
          <a onClick={openModal}>
            <button className="pl-10 pr-10 pt-2 pb-2 link">
              Not vote any projects{votes > 0 ? `(Voted ${votes})` : ''}
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
