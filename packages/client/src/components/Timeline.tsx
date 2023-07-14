import CheckCircleIcon from '../../public/icon_check_circle.svg';
import NotFinishedIcon from '../../public/icon_not_finished.svg';
import { useMUD } from '../MUDContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const timestampToDateString = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);
  let formattedDate = `${
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
}) => {
  const {
    systemCalls: { proceedPhase },
  } = useMUD();

  return (
    <div className="w-1/4 relative h-100">
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
            src={phase > 2 ? CheckCircleIcon : NotFinishedIcon}
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
            src={phase > 3 ? CheckCircleIcon : NotFinishedIcon}
            className=" -ml-2"
            alt="Check circle icon"
          />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Voting</h2>
          <p className="text-gray-500">{timestampToDateString(votingPeriod)}</p>
        </div>
      </div>

      <div className="mt-10">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            await proceedPhase(hackathonId);
          }}
        >
          Proceed Phase
        </button>
      </div>
    </div>
  );
};

export default Timeline;
