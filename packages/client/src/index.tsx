import ReactDOM from 'react-dom/client';
import { mount as mountDevTools } from '@latticexyz/dev-tools';
import { App } from './App';
import { setup } from './mud/setup';
import { MUDProvider } from './MUDContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HackathonPage } from './hackathon/[id]';
import { ProjectPage } from './project/[address]';
import WalletConnection from './WalletConnection';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { optimism, optimismGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [optimism, optimismGoerli],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID || '' }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const rootElement = document.getElementById('react-root');
if (!rootElement) throw new Error('React root not found');
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  root.render(
    <MUDProvider value={result}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: '#333333',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          <Router>
            <Routes>
              <Route path="/hackathon/:id" element={<HackathonPage />} />
              <Route path="/project/:address" element={<ProjectPage />} />
              <Route path="/" element={<App />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </MUDProvider>,
  );
  mountDevTools();
});
