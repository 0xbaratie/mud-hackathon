import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';

interface VoteModalProps {
  hackathonId: string;
  submitter: string;
  setError: (error: string | null) => void; 
  setSuccess: (success: string | null) => void;
}

const VoteModal = ({ hackathonId, submitter, setError, setSuccess}: VoteModalProps) => {
  const {
    systemCalls: { vote },
  } = useMUD();
  return (
    <div className="p-6">
      <p className="font-bold text-xl flex justify-center">
        Will you take advantage of your right to vote?
      </p>
      <div className="mt-6 flex justify-center">
        <button
          className="btn bg-black text-white rounded-lg w-80"
          onClick={async (event) => {  
            event.preventDefault();        
            try {
              await vote(hackathonId, submitter);
              setSuccess('Your vote has been cast!.');
            } catch (error) {
              console.error(error);
              setError('An error occurred while voting.');
            }
          }}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default VoteModal;
