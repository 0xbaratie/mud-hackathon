import { useMUD } from './MUDContext';
// import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EventCards } from './components/EventCards';
// import { SyncState } from '@latticexyz/network';
import FullScreenModal from './components/FullScreenModal';
import HackathonForm from './components/HackathonForm';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { ToastError } from './components/ToastError';
import { ToastSuccess } from './components/ToastSuccess';

export const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    // components: { Hackathon, Config },
    network: { worldContract },
  } = useMUD();
  const [maxHackathonNum, setMaxHackathonNum] = useState(0);
  useEffect(() => {
    (async () => {
      const maxHackathonId = await worldContract.getMaxHackathonId();
      console.log('maxHackathonId: ', maxHackathonId);
      const bigNum = ethers.BigNumber.from(maxHackathonId);
      setMaxHackathonNum(bigNum.toNumber());
    })();
  }, [maxHackathonNum]);

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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <div className="text-center mt-12 mb-6">
        <h1 className="font-bold text-3xl">
          Autonomous World <br /> hackathons for future
        </h1>
        <p className="text-[#9D9D9D] text-xl mt-4 mb-8">
          Build products, practice skills, learn technologies, win prizes, and grow your network
        </p>
      </div>

      {/* {loadingState.state !== SyncState.LIVE ? (
        <div className="font-dot text-center mt-32">
          {loadingState.msg}
          <br />
          <progress
            className="mt-6 [&::-webkit-progress-bar]:rounded-sm [&::-webkit-progress-value]:rounded-sm [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-black [&::-moz-progress-bar]:bg-black"
            value={Math.floor(loadingState.percentage)}
            max="100"
          />
        </div>
      ) : (
        <EventCards />
      )} */}

      <div className="text-center">
        <a onClick={openModal}>
          <button className="btn bg-[#333333] text-white rounded-lg">Create a hackathon</button>
        </a>
      </div>

      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <HackathonForm
          onClose={closeModal}
          maxHackathonNum={maxHackathonNum}
          setMaxHackathonNum={setMaxHackathonNum}
          setError={setError}
          setSuccess={setSuccess}
        />
      </FullScreenModal>

      <EventCards maxHackathonNum={maxHackathonNum} />

      <Footer />
    </>
  );
};
