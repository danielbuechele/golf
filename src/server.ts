import { client } from "./graphql-client.js";
import type {
  LoginUserMutation,
  LoginUserMutationVariables,
  GetDataQueryVariables,
  GetDataQuery,
} from "../generated/graphql.js";
import { LOGIN_USER, GET_DATA } from "./queries.js";
import { getWeatherData, WeatherData } from "./weather.js";

export function getLocalDate(offsetDays: number = 0): string {
  const now = new Date();
  const localDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );
  localDate.setDate(localDate.getDate() + offsetDays);
  return localDate.toISOString().split("T")[0];
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
    },
    {
      Authorization: `Bearer ${result.loginUser.accessToken}`,
    }
  );

  const weatherData = await getWeatherData();

  // Get all friends (including me)
  const friends = data.findFriends.players;

  // Create a set of friend names for quick lookup
  const friendNames = new Set(
    friends.map((friend) => `${friend.firstName} ${friend.lastName}`)
  );

  // Define booking type
  type Booking = {
    date: string;
    time: string;
    courseId: number;
    players: Array<{
      firstName: string;
      lastName: string;
      hcp: number | null;
    }>;
  };

  // Helper function to process bookings for a day
  function processBookingsForDay(
    dayBookings: GetDataQuery["course1day1"][],
    weatherData: WeatherData
  ): {
    date: string;
    bookings: Booking[];
  } {
    const result: Booking[] = [];

    for (const booking of dayBookings) {
      if (!booking.bookingType) {
        continue;
      }

      const courseId = booking.bookingType.courseid!;

      for (const slot of booking.bookingType.slots || []) {
        if (slot.isPast) {
          continue;
        }
        // Check if at least one player in this booking is a friend
        const hasFriend = slot.bookingPersons.some((person) =>
          friendNames.has(`${person.firstName} ${person.lastName}`)
        );

        if (
          !hasFriend &&
          !slot.bookingPersons.some((person) => person.isMyBooking)
        ) {
          continue;
        }

        // Create the booking object
        const bookingObj = {
          date: slot.date,
          time: new Date(slot.date).toLocaleString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Berlin",
          }),
          courseId,
          isMyBooking: slot.bookingPersons.some((person) => person.isMyBooking),
          players: slot.bookingPersons.map((person) => ({
            firstName: person.firstName || "",
            lastName: person.lastName || "",
            hcp: parseHCP(person.hcpi),
          })),
        };

        result.push(bookingObj);
      }
    }

    // Sort bookings by time (earliest first)
    return {
      date: new Date(dayBookings[0].bookingType!.slots[0].date).toLocaleString(
        "de-DE",
        {
          weekday: "long",
          month: "numeric",
          day: "numeric",
        }
      ),
      ...weatherData,
      bookings: result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    };
  }

  return {
    days: [
      processBookingsForDay(
        [data.course1day1, data.course2day1],
        weatherData[0]
      ),
      processBookingsForDay(
        [data.course1day2, data.course2day2],
        weatherData[1]
      ),
      processBookingsForDay(
        [data.course1day3, data.course2day3],
        weatherData[2]
      ),
    ],
    updatedAt: new Date().toLocaleString("de-DE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
    }),
  };
}
