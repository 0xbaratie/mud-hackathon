import { useMUD } from './../MUDContext';
import { Header } from './../components/Header';
import { Footer } from './../components/Footer';
import React, { useState } from 'react';

export const ProjectPage: React.FC = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();
  const [activeTab, setActiveTab] = useState(1);
  const imageURL = "https://storage.googleapis.com/ethglobal-api-production/projects%2F0wa8j%2Fimages%2FScreenshot%20(44).png"
  
  return (
    <>
      <Header />
      <div className="bg-gray-100 p-10">
        <img className="h-[334px] w-[590px] object-cover" src={imageURL} alt="Image"></img>
        <h1 className="text-3xl font-bold mt-8">EdgeCause</h1>
        <p className="text-gray-400 mt-1">EdgeCause: Empowering Change through Decentralized Campaigns. Join our portal, where
individuals and organizations harness the crowd's power.</p>
        <div className="mt-8">
          <button className="btn bg-black text-white rounded-lg w-30">Live Demo</button>
          <button className="ml-2 btn bg-white text-black rounded-lg w-30">Source Code</button>
        </div>
      </div>
      <div className="p-10">
        <h2 className="font-bold text-2xl mt-4 mb-2">Project Description</h2>
        <p className="text-gray-400 mt-2">Introducing EdgeCause, the revolutionary portal that empowers individuals and organizations to drive
meaningful change through decentralized campaigns. At EdgeCause, we believe that every voice
matters, and by harnessing the power of the crowd, we can create a collective force for good.</p>
        <p className="text-gray-400 mt-2">Gone are the days of relying on traditional centralized platforms. EdgeCause embraces the spirit of
decentralization, providing a dynamic and inclusive space where ideas flourish, and campaigns thrive. We
offer a groundbreaking platform that enables individuals and organizations to launch and promote their
campaigns, while leveraging the strength of a global community.</p>
        <p className="text-gray-400 mt-2">With EdgeCause, you have the freedom to champion causes close to your heart. Whether you're raising
funds for social justice, environmental sustainability, education, healthcare, or any other pressing issue,
our portal is your gateway to success. We empower you to amplify your voice, rally support, and ignite a
movement.</p>
        
        
        <h2 className="font-bold text-2xl mt-4 mb-2">How to make</h2>
        <p className="text-gray-400 mt-2">EdgeCause is built using a powerful stack of technologies including ThirdWeb, React, Vite JavaScript, and
an SDK deployed on FVM (Flutter Version Management). Let's dive into each component:</p>
        <p className="text-gray-400 mt-2">ThirdWeb: EdgeCause leverages ThirdWeb, a decentralized web development 
framework, to enable the decentralized nature of the platform. ThirdWeb allows 
for the seamless integration of blockchain technology and smart contracts, 
ensuring transparency, security, and immutability in campaign operations.</p>
        <p className="text-gray-400 mt-2">React: The user interface of EdgeCause is developed using React, a popular 
JavaScript library for building dynamic and interactive web applications. 
React provides a modular and component-based approach, making it easier to 
develop and maintain a scalable and responsive user interface.</p>
        <p className="text-gray-400 mt-2">Vite JavaScript: Vite JavaScript is used as the development server and build 
tool for EdgeCause. Vite offers fast and efficient development by utilizing an 
innovative module bundler, enabling rapid hot module replacement (HMR) for 
instant feedback during development.</p>
        <p className="text-gray-400 mt-2">SDK Deployed on FVM: The EdgeCause software development kit (SDK) is deployed 
on FVM, which stands for Flutter Version Management. FVM is a tool that allows 
developers to manage and switch between different versions of Flutter, a 
popular open-source UI framework for building natively compiled applications.</p>
        <p className="text-gray-400 mt-2">By utilizing these technologies, EdgeCause achieves a robust and performant platform that combines
        the power of decentralized campaigns with modern web development practices. The combination of
        ThirdWeb, React, Vite JavaScript, and the SDK deployed on FVM creates a seamless and user-friendly
        experience, empowering users to participate in decentralized crowdfunding and drive impactful change.</p>
      </div>
      <Footer activeTab={activeTab}/>
    </>
  );
};
