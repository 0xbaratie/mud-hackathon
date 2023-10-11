import { FC, useState, useEffect } from 'react';
import { useMUD } from '../MUDContext';
import { Transition } from '@headlessui/react';
import { ToastSuccess } from './ToastSuccess';
import { ToastError } from './ToastError';

type HackathonSubmitProps = {
  onClose: () => void;
  hackathonId: string;
};

const HackathonSubmit: FC<HackathonSubmitProps> = ({ onClose, hackathonId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uri, setUri] = useState('');
  const [imageUri, setImageUri] = useState('');
  const {
    systemCalls: { submit },
  } = useMUD();

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let errorTimer: NodeJS.Timeout | null = null;

    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }

    if (error) {
      errorTimer = setTimeout(() => {
        setError(null);
      }, 10000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccess, error]);

  return (
    <div className="p-6 mb-40">
      <Transition
        show={showSuccess}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {showSuccess && <ToastSuccess message='success' />}
      </Transition>

      <Transition
        show={!!error && error.length > 0}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {error && error.length > 0 && <ToastError message={error} />}
      </Transition>
      <h1 className="text-md mb-2">Project title</h1>
      <p className="text-sm text-gray-500 mb-1">
        Max 40-character or less description of your project title.
      </p>
      <input
        type="text"
        placeholder="Enter your project title"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* <h1 className="text-md mb-2 mt-6">
        If you have a demonstration, link to it here! (Optional)
      </h1>
      <input
        type="text"
        placeholder="xxxxx.vercel.com"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
      /> */}

      <h1 className="text-md mb-2 mt-6">Short description</h1>
      <p className="text-sm text-gray-500 mb-1">
        Max 280-character or less description of your project (it should fit in a tweet!)
      </p>
      <input
        type="text"
        placeholder="Enter additional information"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* <h1 className="text-md mb-2 mt-6">Description</h1>
      <p className="text-sm text-gray-500 mb-1">
        Go in as much detail as you can about what this project is. Please be as clear as possible!
      </p>
      <textarea
        placeholder="Enter additional information"
        className="textarea textarea-bordered textarea-md w-full max-w-xs"
      ></textarea> */}

      {/* <h1 className="text-md mb-2 mt-6">How to make?</h1>
      <p className="text-sm text-gray-500 mb-1">
        Tell us about how you built this project; the nitty-gritty details. <br />
        What technologies did you use? How are they pieced together? <br /> If you used any sponsor
        technologies, how did it benefit your project? <br />
        Did you do anything particuarly hacky that is notable and worth mentioning?
      </p>
      <textarea
        placeholder="Enter additional information"
        className="textarea textarea-bordered textarea-md w-full max-w-xs"
      ></textarea> */}

      {/* <h1 className="text-md mb-2 mt-6">
        GitHub public repository or a link to the source code (Optional)
      </h1>
      <p className="text-sm text-gray-500 mb-1">
        Where we can go to view the source code, development activity, or design history. <br />
        If your design work was composed entirely on something like Figma, then you can link that
        here.
      </p>
      <input
        type="text"
        placeholder="github.com/xxxxx/yyyyy"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
      /> */}

      <h1 className="text-md mb-2 mt-6">Project URL</h1>
      <p className="text-sm text-gray-500 mb-1"></p>
      <input
        type="text"
        placeholder="https://xxxxx/yyyyy"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />

      {/* <h1 className="text-md mb-2 mt-6">Demo video (Optional)</h1>
      <p className="text-sm text-gray-500 mb-1">
        • Please ensure the video is between 2 and 4 minutes
        <br />• Please ensure that minimum video resolution is 720p <br />• Please ensure the video
        has audio without music
      </p>
      <input
        type="text"
        placeholder="loom.com/xxxxxxxxxxx"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
      /> */}

      <h1 className="text-md mb-2 mt-6">Cover image</h1>
      <p className="text-sm text-gray-500 mb-1">
        The ideal aspect ratio is 16:9 - for example 640x360 px.
      </p>
      <input
        type="text"
        placeholder="http://arweave.net/xxxxxxxxxxxxxx"
        className="input input-bordered w-full max-w-xs mt-2 text-gray-900"
        value={imageUri}
        onChange={(e) => setImageUri(e.target.value)}
      />

      <div className="mt-10">
        <button
          className="btn bg-[#333333] text-white rounded-lg"
          onClick={async (event) => {
            event.preventDefault();
            try {
              await submit(hackathonId, name, description, uri, imageUri);
              setShowSuccess(true);
              onClose();
            } catch (error) {
              setError('An error occurred while submitting your project.');
            }
          }}
          disabled={name.length > 40 || description.length > 280} 
        >
          
          Submit your project
        </button>
      </div>
    </div>
  );
};

export default HackathonSubmit;
