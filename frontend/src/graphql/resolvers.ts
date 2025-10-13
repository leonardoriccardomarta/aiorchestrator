export const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
  },
  Mutation: {
    echo: (_: unknown, { message }: { message: string }) => message,
  },
  Subscription: {
    countdown: {
      subscribe: async function* (_: unknown, { from }: { from: number }) {
        for (let i = from; i >= 0; i--) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          yield { countdown: i };
        }
      },
    },
  },
}; 