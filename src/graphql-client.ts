import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

const endpoint = 'https://backend-germering4u.cio.golf/';

export const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sdk = getSdk(client);