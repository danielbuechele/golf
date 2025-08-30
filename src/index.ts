import { gql } from "graphql-request";
import { client } from "./graphql-client";
import type {
  LoginUserMutation,
  LoginUserMutationVariables,
  FindFriendsQuery,
  FindFriendsQueryVariables,
} from "../generated/graphql";
import { FIND_FRIENDS } from "./queries";

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

function parseBasicAuth(authHeader: string | null | undefined): {
  username: string;
  password: string;
} {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  if (!username || !password) {
    throw new Error("Invalid credentials format");
  }

  return { username, password };
}

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    try {
      const authHeader = request.headers.get("authorization");
      const credentials = parseBasicAuth(authHeader);

      const result = await client.request<
        LoginUserMutation,
        LoginUserMutationVariables
      >(LOGIN_USER, {
        email: credentials.username,
        password: credentials.password,
      });

      if (!result.loginUser.accessToken) {
        throw new Error("Login failed - no tokens returned");
      }

      const friendsResult = await client.request<
        FindFriendsQuery,
        FindFriendsQueryVariables
      >(
        FIND_FRIENDS,
        {
          bookingTypeId: null,
          slotDate: null,
          checkPayment: false,
        },
        {
          Authorization: `Bearer ${result.loginUser.accessToken}`,
        }
      );

      return new Response(
        JSON.stringify({
          friends: friendsResult.findFriends,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Request error:", error);
      return new Response(
        JSON.stringify({
          message: "Internal server error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
});

console.log(`Server is running on port ${server.port}`);
