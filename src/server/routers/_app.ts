/**
 * This file contains the root router of your tRPC-backend
 */
import { router, publicProcedure } from '../trpc';
import { observable } from '@trpc/server/observable';
import { clearInterval } from 'timers';
import { z } from 'zod';
import { EventEmitter } from 'events';

type Data = {
  temperature: number | null;
};

const data: Data = {
  temperature: null,
};

interface MyEvents {
  add: (data: number) => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  add: publicProcedure
    .input(
      z.object({
        temperature: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      data.temperature = input.temperature;
      ee.emit('add', input.temperature);

      return data.temperature;
    }),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 2000);
      return () => {
        clearInterval(int);
      };
    });
  }),

  onAdd: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const onAdd = (data: number) => emit.next(data);
      ee.on('add', onAdd);
      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
