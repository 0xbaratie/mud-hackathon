import CheckCircleIcon from '../../public/icon_check_circle.svg';
import NotFinishedIcon from '../../public/icon_not_finished.svg';
import { useMUD } from '../MUDContext';
import { useState } from 'react';
import { PHASE } from '../constants/constants';
import { useInterval } from '../hooks/useInterval';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const timestampToDateString = (timestamp: any) => {
  const date = new Date(Number(timestamp) * 1000);

  // Use methods to retrieve UTC date and time values
  const formattedDate = `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}, ${date.getUTCHours()}:${('0' + date.getUTCMinutes()).slice(-2)}`;

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
  owner,
}: any) => {
  const { showToast, toastType } = useToast();
  const [myAddress, setMyAddress] = useState('');
  const {
    systemCalls: { proceedPhase },
    network: { signerOrProvider },
  } = useMUD();

  useInterval(() => {
    (async () => {
      const _myAddress = await signerOrProvider.getAddress();
      setMyAddress(_myAddress);
    })();
  }, 5000);

  return (
    <div className="w-1/4 relative h-100">
      <Toast toastType={toastType} />
      <div className="mt-8">
        <div className="absolute">
          <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold">Deposit prize</h2>
          <p className="text-gray-500">{timestampToDateString(startTimestamp)} GMT</p>
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
          <p className="text-gray-500">{timestampToDateString(submitPeriod)} GMT</p>
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
          <p className="text-gray-500">{timestampToDateString(votingPeriod)} GMT</p>
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
          <p className="text-gray-500">{timestampToDateString(withdrawalPeriod)} GMT</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img
            src={phase > PHASE.WITHDRAWING ? CheckCircleIcon : NotFinishedIcon}
            className=" -ml-2"
            alt="Check circle icon"
          />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">End Hacking</h2>
          <p className="text-gray-500">Hack owner can withdraw remaining prize</p>
        </div>
      </div>

      {owner === myAddress && (
        <div className="mt-12">
          <button
            className="btn bg-[#333333] text-white rounded-xl"
            onClick={async (event) => {
              event.preventDefault();
              try {
                await proceedPhase(hackathonId);
                setPhase(phase + 1);
                showToast('success');
              } catch (error) {
                console.error(error);
                showToast('error');
              }
            }}
          >
            Proceed Phase
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
