import { useMUD } from '../MUDContext';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useInterval } from '../hooks/useInterval';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

interface HackathonOverviewProps {
  uri: string;
  name: string;
  owner: string;
  hackathonId: string;
}

const HackathonOverview = ({ uri, name, owner, hackathonId }: HackathonOverviewProps) => {
  const { showToast, toastType } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [myAddress, setMyAddress] = useState('');
  const [administrator, setAdministrator] = useState('');

  const {
    systemCalls: { deleteHackathon, deleteHackathonByAdmin },
    network: { signerOrProvider, worldContract },
  } = useMUD();

  useEffect(() => {
    (async () => {
      const _administrator = await worldContract.getAdministrator();
      setAdministrator(_administrator);
    })();
  });

  useInterval(() => {
    (async () => {
      const _myAddress = await signerOrProvider.getAddress();
      setMyAddress(_myAddress);
    })();
  }, 5000);

  if (shouldRedirect) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="">
      <Toast toastType={toastType} />
      <div className="ml-2 font-bold">
        <p className="text-2xl">{name}</p>
      </div>
      <div className="flex">
        {/* <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
          className="w-[24px] h-[24px] object-cover rounded-full"
        /> */}
        {/* <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2 mt-4">{owner}</div> */}
        {/* <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2">June 1st, 2023</div> */}
      </div>
      {/* <div className="mt-4">
        <p className="text-2xl font-bold">{name}</p>
        <p className=" w-full mt-2">
          We invite you to join the first virtual Autonomous Worlds hackathon, where participants
          will explore the potential of multi-author Worlds by developing onchain games, worlds, and
          art projects. Leverage the power of MUD, a new framework designed for ambitious Ethereum
          applications, and follow in the footsteps of dozens of teams that have already built
          unique projects with it, including OPCraft — an onchain <br /> voxel world, EVM Factorio,
          real-time strategy games, and more. By working with the MUD framework, participants will
          not only contribute to the growth of these worlds but also deepen the understanding of the
          concept of Autonomous Worlds and its implications in technology and digital collaboration.{' '}
        </p>
      </div> */}

      <button className="mt-6 bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl mr-2">
        <a href={uri} target="_blank" rel="noopener noreferrer">
          Detail
        </a>
      </button>
      {myAddress === owner && (
        <button
          className="mt-6 bg-white text-[#333333] border border-[#333333] pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await deleteHackathon(hackathonId);
              showToast('success');
              setShouldRedirect(true);
            } catch (error) {
              console.error(error);
              showToast('error');
            }
          }}
        >
          Delete hackathon
        </button>
      )}
      {myAddress === administrator && (
        <button
          className="mt-6 bg-white text-[#333333] border border-[#333333] pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await deleteHackathonByAdmin(hackathonId);
              showToast('success');
              setShouldRedirect(true);
            } catch (error) {
              console.error(error);
              showToast('error');
            }
          }}
        >
          Delete hackathon
        </button>
      )}
    </div>
  );
};

export default HackathonOverview;
