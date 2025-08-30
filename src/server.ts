import { client } from "./graphql-client.js";
import type {
  LoginUserMutation,
  LoginUserMutationVariables,
  GetDataQueryVariables,
  GetDataQuery,
} from "../generated/graphql.js";
import { LOGIN_USER, GET_DATA } from "./queries.js";

export function getLocalDate(offsetDays: number = 0): string {
  const now = new Date();
  const localDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );
  localDate.setDate(localDate.getDate() + offsetDays);
  return localDate.toISOString().split("T")[0];
}

export function getBookingDates(
  bookings: GetDataQuery["course1day1"][],
  {
    firstName,
    lastName,
  }: {
    firstName?: string | null;
    lastName?: string | null;
  }
) {
  const bookingDates: Array<{
    date: Date;
    courseId: number;
  }> = [];
  for (const booking of bookings) {
    for (const slot of booking.bookingType?.slots || []) {
      for (const person of slot.bookingPersons) {
        if (slot.date < new Date().toISOString()) {
          continue;
        }
        if (person.firstName === firstName && person.lastName === lastName) {
          bookingDates.push({
            date: new Date(slot.date),
            courseId: booking.bookingType!.courseid!,
          });
        }
      }
    }
  }

  return bookingDates;
}

export function getAvatarLink(
  bookings: GetDataQuery["course1day1"][],
  {
    firstName,
    lastName,
  }: {
    firstName?: string | null;
    lastName?: string | null;
  }
) {
  for (const booking of bookings) {
    for (const slot of booking.bookingType?.slots || []) {
      for (const person of slot.bookingPersons) {
        if (person.firstName === firstName && person.lastName === lastName) {
          return person.avatarLink;
        }
      }
    }
  }
  return null;
}

export function parseBasicAuth(authHeader: string | null | undefined): {
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

export function parseHCP(hcp: string | null | undefined): number | null {
  if (!hcp) {
    return null;
  }

  const float = parseFloat(hcp.replace(",", ".").replace(/[^0-9.]/g, ""));
  if (isNaN(float)) {
    return null;
  }

  return float;
}

export async function handleRequest(authHeader: string | null | undefined) {
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

  const data = await client.request<GetDataQuery, GetDataQueryVariables>(
    GET_DATA,
    {
      dateOne: getLocalDate(0),
      dateTwo: getLocalDate(1),
      dateThree: getLocalDate(2),
      dateFour: getLocalDate(3),
      dateFive: getLocalDate(4),
    },
    {
      Authorization: `Bearer ${result.loginUser.accessToken}`,
    }
  );

  const bookings = [
    data.course1day1,
    data.course2day1,
    data.course1day2,
    data.course2day2,
    data.course1day3,
    data.course2day3,
    data.course1day4,
    data.course2day4,
    data.course1day5,
    data.course2day5,
  ];

  const [me, ...friends] = [
    ...data.me.flightPlayers,
    ...data.findFriends.players,
  ].map((p) => ({
    firstName: p.firstName,
    lastName: p.lastName,
    hcp: parseHCP(p.hcp),
    bookingDates: getBookingDates(bookings, p),
    avatarLink: getAvatarLink(bookings, p) || null,
  }));

  return {
    me,
    friends,
  };
}
