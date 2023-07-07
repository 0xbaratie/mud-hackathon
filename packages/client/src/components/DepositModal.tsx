import React, { FC } from 'react';

const DepositModal = () => {
  return (
    <div className="p-6">
      <p className="font-bold text-sm">Deposit USDC</p>
      <div className="mt-4 w-full">
        <input
          type="text"
          placeholder="0.0"
          className="input input-bordered w-full text-gray-300"
        />
        <button className="mt-2 btn bg-[#333333] text-white rounded-lg w-full">Deposit</button>
      </div>
    </div>
  );
};

export default DepositModal;
