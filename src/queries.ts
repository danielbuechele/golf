import { gql } from 'graphql-request';

export const REFRESH_ACCESS_TOKEN = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(input: {refreshToken: $refreshToken}) {
      accessToken
    }
  }
`;

export const FIND_FRIENDS = gql`
  query findFriends($bookingTypeId: String, $slotDate: String, $checkPayment: Boolean) {
    findFriends(
      input: {bookingTypeId: $bookingTypeId, slotDate: $slotDate, checkPayment: $checkPayment}
    ) {
      players {
        id
        firstName
        lastName
        hcp
      }
    }
  }
`;