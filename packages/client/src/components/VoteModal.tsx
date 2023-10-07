import React, { FC, useEffect, useState } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';

interface VoteModalProps {
  onClose: () => void;
  hackathonId: string;
  votesNum: Record<string, number>;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  displayNum: boolean;
}

const VoteModal = ({ onClose, hackathonId, votesNum, setError, setSuccess, displayNum}: VoteModalProps) => {
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
      setError('An error occurred while voting.(Check if you have already voted or are entitled to vote)');
    }
    
    onClose();
  };

  let totalVotes = 0;
  Object.values(votesNum).forEach(votes => {
    totalVotes += votes;
  });

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl flex justify-center">Caution!</h2>
      <p className="text-xl flex justify-center">
      Once you vote, you cannot undo or overwrite. Also, even if you have an extra vote, you cannot cast an additional vote. Is everything ok?
      </p>
      
      <p className="text-xl font-bold flex justify-center mt-1" >
        {displayNum ? `${totalVotes} selected` : ``}
      </p>

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
