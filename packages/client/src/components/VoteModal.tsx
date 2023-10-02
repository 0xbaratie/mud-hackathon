import React, { FC, useEffect, useState } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';

interface VoteModalProps {
  onClose: () => void;
  hackathonId: string;
  votesNum: Record<string, number>;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const VoteModal = ({ onClose, hackathonId, votesNum, setError, setSuccess}: VoteModalProps) => {
  const {
    systemCalls: { vote },
  } = useMUD();
  
  const handleVote = async () => {
    // If multiple votes are cast for the same project, the number of array elements must be increased for that project.
    const submitters = Object.entries(votesNum).flatMap(([submitter, count]) => 
      Array(count).fill(submitter)
    );

    try {
      await vote(hackathonId, submitters);
      setSuccess('Your vote has been cast!.');
    } catch (error) {
      setError('An error occurred while voting.');
    }
    
    onClose();
  };

  return (
    <div className="p-6">
      <p className="font-bold text-xl flex justify-center">
      Once a vote is made, it cannot be undone or overwritten. Is it OK?
      </p>
      {votesNum && Object.entries(votesNum).map(([submitter, votes]) => (
        <p className="text-xl flex justify-center" key={submitter}>
          {submitter}: {votes}
        </p>
      ))}

      <div className="mt-6 flex justify-center">
        <button
          className="btn bg-black text-white rounded-lg w-80"
          onClick={event => {
            event.preventDefault();
            handleVote();
          }}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default VoteModal;
