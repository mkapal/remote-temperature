import ws from 'ws';
import { z } from 'zod';

const wss = new ws.Server({
  port: 3001,
});

const HISTORY_SAVE_INTERVAL = 60; // Seconds - according to Arduino update frequency
const HISTORY_MAX_SIZE = 300;

export const latestTemperatures: number[] = [];
export let sinceLastHistoryWrite = HISTORY_SAVE_INTERVAL;

wss.on('connection', (socket) => {
  console.log(`> Server listening at ws://localhost:3001`);

  socket.onmessage = ({ data }) => {
    if (typeof data !== 'string') {
      return;
    }

    const schema = z.object({
      temperature: z.number(),
    });

    try {
      const parsed = schema.safeParse(JSON.parse(data));

      if (!parsed.success) {
        console.error('Failed to parse data');
        return;
      }

      const { temperature } = parsed.data;

      if (sinceLastHistoryWrite >= HISTORY_SAVE_INTERVAL) {
        if (latestTemperatures.length >= HISTORY_MAX_SIZE) {
          latestTemperatures.shift();
        }

        latestTemperatures.push(temperature);
        console.info('Write temperature to history', temperature);

        sinceLastHistoryWrite = 1;
      } else {
        sinceLastHistoryWrite++;
      }

      const otherConnectedClients = Array.from(wss.clients.values()).filter(
        (client) => client !== socket && client.readyState === ws.OPEN,
      );

      if (otherConnectedClients.length === 0) {
        return;
      }

      otherConnectedClients.forEach((client) => {
        console.log('Sending temperature to client');
        client.send(
          JSON.stringify({
            temperature,
            timestamp: new Date(),
            latestTemperatures,
          }),
        );
      });
      console.log('Message received', temperature);
    } catch (err) {
      console.error('Failed to parse JSON data', err);
    }
  };
});

process.on('SIGTERM', () => {
  console.log('SIGTERM');
});
