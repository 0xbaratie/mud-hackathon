import { ReactNode, useEffect, useState } from 'react';
import { mount as mountDevTools } from '@latticexyz/dev-tools';
import { setup } from './mud/setup';
import { MUDProvider } from './MUDContext';

type Props = {
  children: ReactNode;
};
const MUDSetup = ({ children }: Props) => {
  const [setupValue, setSetupValue] = useState<any | null>(null);

  useEffect(() => {
    setup()
      .then((result) => {
        if (result) {
          setSetupValue(result);
        } else {
          console.error("Setup function returned null or undefined");
        }
      })
      .catch((error) => {
        console.error("Setup function error:", error);
      });
    mountDevTools();
  }, []);
  
  return <>{setupValue && <MUDProvider value={setupValue}>{children}</MUDProvider>}</>;
};

export default MUDSetup;
