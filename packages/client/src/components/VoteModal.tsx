import React, { FC } from 'react';
import DateTimePicker from './DateTimePicker';

const VoteModal = () => {
  return (
    <div className="p-6">
      <p className="font-bold text-xl flex justify-center">Will you take advantage of your right to vote?</p>
      <div className="mt-6 flex justify-center">
        <button className="btn bg-black text-white rounded-lg w-80">Vote</button>
      </div>
    </div>
  );
};

export default VoteModal;
