import CheckCircleIcon from '../../public/icon_check_circle.svg';
import NotFinishedIcon from '../../public/icon_not_finished.svg';

const Timeline = () => {
  return (
    <div className="w-1/4 relative h-100">
      <div className="mt-2">
        <div className="absolute">
          <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold">Creating the hackathon project</h2>
          <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img src={CheckCircleIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold">Deposit prize</h2>
          <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img src={NotFinishedIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Hack start</h2>
          <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img src={NotFinishedIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Project submit due date</h2>
          <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="absolute">
          <img src={NotFinishedIcon} className=" -ml-2" alt="Check circle icon" />
        </div>
        <div className="pl-4 z-0 relative">
          <h2 className="font-bold text-[#4D4D4D]">Voting</h2>
          <p className="text-gray-500">July 3, 2023, 4:23pm UTC</p>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
