const HackathonOverview = ({ uri, name }) => {
  return (
    <div className="">
      <div className="flex">
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
          className="w-[24px] h-[24px] object-cover rounded-full"
        />
        <span className="ml-2 font-bold">libdefi</span>
        <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2">0xCDF4</div>
        <div className="ml-2 bg-gray-200 text-gray-400 rounded-lg pr-2 pl-2">June 1st, 2023</div>
      </div>
      <div className="mt-4">
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
      </div>

      <button className="mt-6 bg-[#333333] text-white pl-4 pr-4 pt-2 pb-2 text-sm rounded-xl">
        <a href={uri} target="_blank" rel="noopener noreferrer">
          Detail
        </a>
      </button>
    </div>
  );
};

export default HackathonOverview;
