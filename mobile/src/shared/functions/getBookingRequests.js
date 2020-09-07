"use strict";

import Bookings from "../../json_placeholder/Bookings";
import Purpose from "../../json_placeholder/Purpose";
import moment from "moment";

/**
 *  Terrible code
 */
function getBookings(bookingType) {
  const date = new Date();

  let bookings = Object.entries(Bookings).map(([_, booking]) => booking);
  bookings = filterBookings(bookings, [bookingType, date]);
  convertForeignKeys(bookings);
  bookings = sortBookings(bookings, [date]);

  return bookings;
}

function filterBookings(bookings, filter) {
  const [bookingType, date] = filter;
  const day = getMomentDay(date);

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.BookingDate);
    const bookingDay = getMomentDay(bookingDate);
    const daysLeft = bookingDay.diff(day, "days");

    return daysLeft >= 0 && (bookingType === "ALL" || booking.Type === bookingType);
  });

  return filteredBookings;
}

function convertForeignKeys(bookings) {
  bookings.forEach(booking => {
    booking["Purpose"] = Purpose[booking.PurposeId].label;
  });
}

function sortBookings(bookings, sort) {
  const sortedBookings = sortBookingsByDay(bookings, sort);
  sortBookingsByServiceProviderType(sortedBookings);

  return sortedBookings;
}

function sortBookingsByDay(bookings, sort) {
  let bookingsByDay = {};

  bookings.forEach(booking => {
    const bookingDate = new Date(booking.BookingDate);
    bookingDate.setHours(0, 0, 0, 0);

    const bookingDay = bookingDate.toISOString();

    if (!bookingsByDay[bookingDay]) {
      bookingsByDay[bookingDay] = [booking];
    }
    else {
      bookingsByDay[bookingDay].push(booking);
    }
  });

  const bookingsEntries = Object.entries(bookingsByDay);

  bookingsEntries.sort((a, b) => {
    const [dateA] = a;
    const [dateB] = b;
    return new Date(dateA) - new Date(dateB);
  });

  const [date] = sort;

  bookingsByDay = bookingsEntries.map(bookingEntry => {
    const [bookingDay, bookings] = bookingEntry;

    const bookingDate = new Date(bookingDay);
    const relativeTime = getRelativeTimeFromNow(bookingDate, date);
    const formattedDate = moment(bookingDay).format("DD MMM");

    const formattedBookingDay = `${relativeTime} ${formattedDate}`.trim().toUpperCase();

    return {
      bookingDate: formattedBookingDay,
      data: bookings
    };
  });

  return bookingsByDay;
}

function getRelativeTimeFromNow(bookingDate, date) {
  const bookingDay = getMomentDay(bookingDate);
  const day = getMomentDay(date);
  const daysUntilDeparture = bookingDay.diff(day, "days");

  let relativeTime = "";

  switch (daysUntilDeparture) {
    case 0:
      relativeTime = "TODAY";
      break;
    case 1:
      relativeTime = "TOMORROW";
      break;
    default:
      break;
  }

  return relativeTime;
}

function getMomentDay(date) {
  return moment([
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ]);
}

function sortBookingsByServiceProviderType(sortedBookings) {
  sortedBookings.forEach(section => {
    const bookingsByServiceProviderType = {
      "PASSENGER": [],
      "RPL": []
    };

    const bookings = section.data;

    bookings.forEach(booking => {
      bookingsByServiceProviderType[booking.ServiceProviderType].push(booking);
    });

    const entries = Object.entries(bookingsByServiceProviderType);

    section["data"] = [entries.map(entry => {
      const [serviceProviderType, bookings] = entry;
      return {
        serviceProviderType,
        data: bookings
      };
    })];
  });
}

export default getBookings;
