import React, { FC } from 'react';
import Upload from '../../public/upload.svg';
const HackathonSubmit = () => {
  return (
    <div className="p-6">
      <h1 className="text-md mb-2">Project title</h1>
      <input
        type="text"
        placeholder="Enter your project title"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-300"
      />

      <h1 className="text-md mb-2 mt-6">If you have a demonstration, link to it here! (Optional)</h1>
      <input
        type="text"
        placeholder="xxxxx.vercel.com"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-300"
      />
     
      <h1 className="text-md mb-2 mt-6">Short description</h1>
      <p className="text-sm text-gray-500 mb-1">
        A max 280-character or less description of your project (it should fit in a tweet!)
      </p>
      <textarea placeholder="Enter additional information" className="textarea textarea-bordered textarea-md w-full max-w-xs" ></textarea>

      <h1 className="text-md mb-2 mt-6">Description</h1>
      <p className="text-sm text-gray-500 mb-1">
        Go in as much detail as you can about what this project is. Please be as clear as possible!
      </p>
      <textarea placeholder="Enter additional information" className="textarea textarea-bordered textarea-md w-full max-w-xs" ></textarea>

      <h1 className="text-md mb-2 mt-6">How to make?</h1>
      <p className="text-sm text-gray-500 mb-1">
        Tell us about how you built this project; the nitty-gritty details. <br />What technologies did you use? How are they pieced together? <br /> If you used any sponsor technologies, how did it benefit your project? <br />Did you do anything particuarly hacky that is notable and worth mentioning?
      </p>
      <textarea placeholder="Enter additional information" className="textarea textarea-bordered textarea-md w-full max-w-xs" ></textarea>

      <h1 className="text-md mb-2 mt-6">GitHub public repository or a link to the source code  (Optional)</h1>
      <p className="text-sm text-gray-500 mb-1">
        Where we can go to view the source code, development activity, or design history. <br />If your design work was composed entirely on something like Figma, then you can link that here.
      </p>
      <input
        type="text"
        placeholder="github.com/xxxxx/yyyyy"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-300"
      />

      <h1 className="text-md mb-2 mt-6">Demo video (Optional)</h1>
      <p className="text-sm text-gray-500 mb-1">
      • Please ensure the video is between 2 and 4 minutes<br />• Please ensure that minimum video resolution is 720p <br />• Please ensure the video has audio without music
      </p>
      <input
        type="text"
        placeholder="loom.com/xxxxxxxxxxx"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-300"
      />

      <h1 className="text-md mb-2 mt-6">Cover image</h1>
      <p className="text-sm text-gray-500 mb-1">
        The ideal aspect ratio is 16:9 - for example 640x360 px.
      </p>
      <img src={Upload} alt='image' className='w-50' />
      <input className='hidden' type='file' />

      <div className="mt-10">
        <button className="btn bg-[#333333] text-white rounded-lg">Submit your project</button>
      </div>
    </div>
  );  
};

export default HackathonSubmit;
