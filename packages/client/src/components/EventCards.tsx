import { EventCard } from './EventCard';

export const EventCards = ({ maxHackathonNum }) => {
  return (
    <div
      className="bg-white mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8"
      style={{ minHeight: '500px' }}
    >
      {Array.from({ length: maxHackathonNum }, (_, i) => i + 1).map((hackathonNum) => (
        <EventCard key={hackathonNum} hackathonNum={hackathonNum} />
      ))}
    </div>
  );
};

export const abi = [
  {
    inputs: [],
    name: 'getMaxHackathonId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
