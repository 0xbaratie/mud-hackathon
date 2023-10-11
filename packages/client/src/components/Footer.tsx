import { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer mt-20 p-2 flex justify-center bg-[#333333] fixed bottom-0 left-0 w-full">
      <div className="">
        <div className="grid grid-flow-col gap-4">
          <a target="_blank" rel="noopener noreferrer" href="https://x.com/AW_house">
          
            <svg width="18" height="18" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
