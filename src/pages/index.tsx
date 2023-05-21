import { useCallback, useEffect, useState } from 'react';
import { animated, Transition } from 'react-spring';
import getConfig from 'next/config';
import { useJSONSockets } from '../hooks';
import type { HistoryValue } from '../components';
import { GlobalStyle, HistoryGraph, Loader } from '../components';

const { publicRuntimeConfig } = getConfig();

type TemperatureData = {
  temperature?: number;
  timestamp?: string;
  latestTemperatures?: number[];
};

export default function IndexPage() {
  const handleTemperatureReceived = useCallback(
    ({ latestTemperatures, temperature, timestamp }: TemperatureData) => {
      setTemperature(temperature);
      setTimestamp(timestamp);

      if (latestTemperatures && latestTemperatures.length > 0) {
        setHistoryData(
          latestTemperatures.map((value: number, idx: number) => ({
            x: idx + 1,
            y: value,
          })),
        );
      }
    },
    [],
  );

  const { state } = useJSONSockets<TemperatureData>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    publicRuntimeConfig.WS_URL!,
    handleTemperatureReceived,
  );
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [historyData, setHistoryData] = useState<HistoryValue[]>([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowData(true), 250);
  }, [setShowData]);

  return (
    <>
      <GlobalStyle temperature={temperature} />
      <div
        className="flex flex-col justify-evenly items-center content-center text-white"
        style={{ width: '100%', height: '100%' }}
      >
        {showData && (
          <Transition
            items={temperature === undefined}
            from={{
              opacity: 0,
              position: 'absolute',
            }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {(style, showLoader) => (
              <animated.div style={style}>
                {showLoader ? (
                  <Loader state={state} />
                ) : (
                  <>
                    <div>
                      {temperature && (
                        <div style={{ fontSize: '30vw' }} className="mb-4">
                          {formatTemperature(temperature)}
                        </div>
                      )}
                      <div>{formatTimestamp(timestamp)}</div>
                    </div>
                    <HistoryGraph points={historyData} />
                  </>
                )}
              </animated.div>
            )}
          </Transition>
        )}
      </div>
    </>
  );
}

const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) {
    return '';
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTemperature = (value: number): string => {
  const fixedString = value.toFixed();
  return (fixedString === '-0' ? '0' : fixedString) + '°';
};
