import { useEffect, useState } from 'react';
import Sockette from 'sockette';

export type WebSocketsState = 'connecting' | 'waiting' | 'loaded' | 'error';

export const useJSONSockets = <Data>(
  serverUrl: string,
  onMessage: (data: Data) => void,
) => {
  const [state, setState] = useState<WebSocketsState>('connecting');

  useEffect(() => {
    const sockette = new Sockette(serverUrl, {
      timeout: 500,
      maxAttempts: 5,
      onopen: () => {
        setState('waiting');
        console.info('Connected');
      },
      onmessage: (event) => {
        try {
          const data = JSON.parse(event.data) as Data;
          onMessage(data);
          setState('loaded');
        } catch (error) {
          console.warn('Could not parse received data:', event.data);
          console.error('Error:', error);
        }
      },
      onreconnect: () => {
        setState('connecting');
        console.info('Reconnecting...');
      },
      onmaximum: () => {
        console.warn('Stop attempting');
      },
      onclose: () => {
        console.warn('Closed');
      },
      onerror: () => {
        setState('error');
        console.error('Connection error');
      },
    });
    return () => sockette.close();
  }, [onMessage, serverUrl]);

  return {
    state,
  };
};
