import { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const addMutation = trpc.add.useMutation();

  const [num, setNumber] = useState<number>();
  trpc.onAdd.useSubscription(undefined, {
    onData(n) {
      setNumber(n);
    },
  });

  return (
    <div>
      Here&apos;s a random number from a sub: {num}
      <button
        onClick={async () => {
          const temperature = await addMutation.mutate({
            temperature: 10,
          });

          console.log({ temperature });
        }}
      >
        set temperature
      </button>
    </div>
  );
}

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
