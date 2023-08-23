import CheckCircleIcon from '../../public/icon_check_circle.svg';
import NotFinishedIcon from '../../public/icon_not_finished.svg';
import { useMUD } from '../MUDContext';
import { PHASE } from '../constants/constants';
import { ToastError } from './ToastError';
import { ToastSuccess } from './ToastSuccess';
import { useState, useEffect } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const timestampToDateString = (timestamp: any) => {
  const date = new Date(Number(timestamp) * 1000);
  const formattedDate = `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}, ${date.getHours()}:${('0' + date.getMinutes()).slice(
    -2,
  )}`;
  return formattedDate;
};
const Timeline = ({
    hackathonId,
    phase,
    startTimestamp,
    submitPeriod,
    votingPeriod,
    withdrawalPeriod,
    setPhase,
  }: any) => {
  console.log('phase', phase);
  const {
    systemCalls: { proceedPhase },
  } = useMUD();


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
    <div className="w-1/4 relative h-100">
      {error && <ToastError message={error} />}
      {success && <ToastSuccess message={success} />}
      <div className="mt-8">
        <div className="absolute">
          <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold">Deposit prize</h2>
          <p className="text-gray-500">{timestampToDateString(startTimestamp)}</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img
            src={phase > PHASE.PREPARE_PRIZE ? CheckCircleIcon : NotFinishedIcon}
            className=" -ml-2"
            alt="Check circle icon"
          />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Hacking</h2>
          <p className="text-gray-500">{timestampToDateString(submitPeriod)}</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img
            src={phase > PHASE.HACKING ? CheckCircleIcon : NotFinishedIcon}
            className=" -ml-2"
            alt="Check circle icon"
          />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Voting</h2>
          <p className="text-gray-500">{timestampToDateString(votingPeriod)}</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img
            src={phase > PHASE.VOTING ? CheckCircleIcon : NotFinishedIcon}
            className=" -ml-2"
            alt="Check circle icon"
          />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Withdrawing prize</h2>
          <p className="text-gray-500">{timestampToDateString(withdrawalPeriod)}</p>
        </div>
      </div>

      <div className="mt-10">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await proceedPhase(hackathonId);
              setPhase(phase + 1);
              setSuccess('Your proceed phase has been cast!.');
            } catch (error) {
              console.error(error);
              setError('An error occurred while voting.');
            }
          }}
        >
          Proceed Phase
        </button>
      </div>
    </div>
  );
};

export default Timeline;
