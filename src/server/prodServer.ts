import http from 'http';
import next from 'next';
import { parse } from 'url';
import ws from 'ws';
import { z } from 'zod';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const HISTORY_SAVE_INTERVAL = 60; // Seconds - according to Arduino update frequency
const HISTORY_MAX_SIZE = 300;

export const latestTemperatures: number[] = [];
export let sinceLastHistoryWrite = HISTORY_SAVE_INTERVAL;

void app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto === 'http') {
      // redirect to ssl
      res.writeHead(303, {
        location: `https://` + req.headers.host + (req.headers.url ?? ''),
      });
      res.end();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parsedUrl = parse(req.url!, true);
    void handle(req, res, parsedUrl);
  });
  const wss = new ws.Server({ server });

  wss.on('connection', (socket) => {
    console.log(`> Server listening at ws://localhost:3000`);

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
  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  );
});
