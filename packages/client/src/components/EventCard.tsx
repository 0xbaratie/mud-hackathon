export const EventCard = () => {
  return (
    <a href="/hackathon/[hackathonAddress]" target="_blank">
      <div className="flex items-center space-x-4 border border-gray-300 border-l-4 h-[190px]">
        <div className="ml-3">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              alt="Shoes"
              className="w-[108px] h-[108px] object-cover "
            />
          </figure>
        </div>
        <div className="card-body">
          <h2 className="card-title text-md">Hack Week Developers Developers</h2>
          <div className="card-actions">
            <button className="bg-black text-white pl-4 pr-4 pt-1 pb-1 text-sm rounded-3xl">
              about 5 hours left
            </button>
          </div>
          <div>
            <span className="font-bold">22.5ETH</span>
            <span className="p-2 text-gray-600">in prizes</span>
            <span className="font-bold">243</span>
            <span className="p-2 text-gray-600">projects</span>
          </div>
        </div>
      </div>
    </a>
  );
};
