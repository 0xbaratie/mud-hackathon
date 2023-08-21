import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';
import { useMUD } from '../MUDContext';

const VoteModal = ({ hackathonId, submitter }) => {
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
            await vote(hackathonId, submitter);
          }}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default VoteModal;
