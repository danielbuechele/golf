import { gql } from "graphql-request";

const BOOKING_TYPE_FRAGMENT = gql`
  fragment BookingTypeFragment on BookingType {
    courseid
    slots {
      date
      bookingPersons {
        firstName
        lastName
        hcpi
        avatarLink
        isMyBooking
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(input: { refreshToken: $refreshToken }) {
      accessToken
    }
  }
`;

export const GET_DATA = gql`
  query getData(
    $dateOne: String!
    $dateTwo: String!
    $dateThree: String!
    $dateFour: String!
    $dateFive: String!
  ) {
    me: getFlightPlayersById(
      input: { id: 0, bookingTypeId: 1, slotDate: "2000-01-01" }
    ) {
      flightPlayers {
        firstName
        lastName
        hcp
      }
    }
    findFriends(input: {}) {
      players {
        id
        firstName
        lastName
        hcp
      }
    }
    course1day1: findTeetimeCourse(
      input: {
        id: 1
        date: $dateOne
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course1day2: findTeetimeCourse(
      input: {
        id: 1
        date: $dateTwo
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course1day3: findTeetimeCourse(
      input: {
        id: 1
        date: $dateThree
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course1day4: findTeetimeCourse(
      input: {
        id: 1
        date: $dateFour
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course1day5: findTeetimeCourse(
      input: {
        id: 1
        date: $dateFive
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course2day1: findTeetimeCourse(
      input: {
        id: 2
        date: $dateOne
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course2day2: findTeetimeCourse(
      input: {
        id: 2
        date: $dateTwo
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course2day3: findTeetimeCourse(
      input: {
        id: 2
        date: $dateThree
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course2day4: findTeetimeCourse(
      input: {
        id: 2
        date: $dateFour
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
    course2day5: findTeetimeCourse(
      input: {
        id: 2
        date: $dateFive
        isMobile: false
        freeSpots: 0
        minHour: 0
        maxHour: 0
      }
    ) {
      bookingType {
        ...BookingTypeFragment
      }
    }
  }
  ${BOOKING_TYPE_FRAGMENT}
`;
