import moment from "moment";

const ServiceProviderTypes = {
  PASSENGER: "P",
  RPL: "RPL"
}

const BookingTypes = {
  ALL: 'All', // All current bookings
  FIXED: 'Fixed',
  OOS: 'OOS',
  ADHOC: 'Ad-Hoc'
}

const BookingStatus = {
  ALL: 'all', // All current bookings
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  PAST: 'Past'
}

export default class Booking {
  bookingCode = '';
  bookingUnit = '';
  displayUserName = '';
  purposeShort = '';
  routeName = '';
  status = '';
  remarks = '';
  cancellationReason = '';
  rejectedReason = '';
  onBoardTime = '';
  bookingGroup = '';
  totalLoad = '';
  feedback = '';
  SPFFeedback = '';
  feedbackType = '';
  comments = '';
  rating = '';
  findings = ''

  constructor(
    date,
    time,
    route,
    purpose,
    bookingUnit,
    serviceProviderType,
    numPassenger,
    vehicles,
    bookingType,
    scheduleId,
    advancedNotice,
    feedback,
    SPFeedback
  ) {
    this.departureDate = date;
    this.departureTime = time;
    this.routeId = route;
    this.purposeId = purpose;
    this.bookingUnit = bookingUnit;
    this.serviceProviderType = serviceProviderType;
    this.numPassenger = numPassenger;
    this.vehicles = vehicles;
    this.bookingType = bookingType;
    this.scheduleId = scheduleId;
    this.advancedNotice = advancedNotice;
    this.SAFFeedback = feedback;
    this.SPFFeedback = SPFeedback;
  }

  getDepartureDate() {
    const formattedDate = moment(this.departureDate).format("YYYY-MM-DD");
    return formattedDate;
  }

  getVehicles() {
    let formattedVehicle = '';
    for (v of this.vehicles) {
      if (formattedVehicle.length > 0) formattedVehicle += ';';
      formattedVehicle += v.id + 'x' + v.quantity;
    }
    return formattedVehicle;
  }

  static sortBookingsByDateAndSPType(bookings) {
    bookings = Booking.sortBookingsByDay(bookings);
    return Booking.sortBookingsByServiceProviderType(bookings, false);
  }

  static sortBookingsByDateAndSPTypeReversed(bookings) {
    bookings = Booking.sortBookingsByDayReversed(bookings);
    return Booking.sortBookingsByServiceProviderType(bookings, false);
  }

  static sortBookingsSwipeable(bookings) {
    bookings = Booking.sortBookingsByDay(bookings);
    return Booking.sortBookingsByServiceProviderType(bookings, true);
  }

  static unsortArray(bookings) {
    let unsortedArray = [];

    bookings.forEach(booking => {
      const data = booking.data;
      data.forEach(bookingData => {
        unsortedArray.push(bookingData);
      })
    })
    return unsortedArray;
  }

  static sortBookingsByDay(bookings) {
    let bookingsByDay = {};

    bookings.forEach(booking => {
      const bookingDate = booking.departureDate;
      if (!bookingsByDay[bookingDate]) {
        bookingsByDay[bookingDate] = [booking];
      }
      else {
        bookingsByDay[bookingDate].push(booking);
      }
    });

    const bookingsEntries = Object.entries(bookingsByDay);
    bookingsEntries.sort();

    const today = moment(new Date()).format('YYYY-MM-DD');
    const tomorrow = moment(new Date()).add(1, 'days').format("YYYY-MM-DD");
    bookingsByDay = bookingsEntries.map(bookingEntry => {
      const [bookingDay, bookings] = bookingEntry;

      let formattedDate = moment(bookingDay).format("DD MMM");
      const departureDate = moment(bookingDay).format('YYYY-MM-DD');
      if (departureDate === today)
        formattedDate = 'TODAY ' + formattedDate;
      else if (departureDate === tomorrow)
        formattedDate = 'TOMORROW ' + formattedDate;

      return {
        bookingDate: formattedDate,
        data: bookings
      };
    });

    return bookingsByDay;
  }

  static sortBookingsByDayReversed(bookings) {
    let bookingsByDay = {};

    bookings.forEach(booking => {
      const bookingDate = booking.departureDate;
      if (!bookingsByDay[bookingDate]) {
        bookingsByDay[bookingDate] = [booking];
      }
      else {
        bookingsByDay[bookingDate].push(booking);
      }
    });

    const bookingsEntries = Object.entries(bookingsByDay);
    bookingsEntries.reverse();

    const today = moment(new Date()).format('YYYY-MM-DD');
    const tomorrow = moment(new Date()).add(1, 'days').format("YYYY-MM-DD");
    bookingsByDay = bookingsEntries.map(bookingEntry => {
      const [bookingDay, bookings] = bookingEntry;

      let formattedDate = moment(bookingDay).format("DD MMM");
      const departureDate = moment(bookingDay).format('YYYY-MM-DD');
      if (departureDate === today)
        formattedDate = 'TODAY ' + formattedDate;
      else if (departureDate === tomorrow)
        formattedDate = 'TOMORROW ' + formattedDate;

      return {
        bookingDate: formattedDate,
        data: bookings
      };
    });

    return bookingsByDay;
  }


  static sortBookingsByServiceProviderType(sortedBookings, swipeable) {

    sortedBookings.forEach(section => {
      const bookingsByServiceProviderType = {
        "PASSENGER": [],
        "RPL": []
      };

      const bookings = section.data;
      bookings.forEach(booking => {
        switch (booking.serviceProviderType) {
          case ServiceProviderTypes.PASSENGER:
            bookingsByServiceProviderType["PASSENGER"].push(booking);
            break;
          case ServiceProviderTypes.RPL:
            bookingsByServiceProviderType["RPL"].push(booking);
            break;
          default:
            break;
        }

      });

      const entries = Object.entries(bookingsByServiceProviderType);

      if (swipeable) {
        section["data"] = [entries.map(entry => {
          const [serviceProviderType, bookings] = entry;
          return {
            serviceProviderType,
            data: bookings
          };
        })];
      }
      else {
        section["data"] = entries.map(entry => {
          const [serviceProviderType, bookings] = entry;
          return {
            serviceProviderType,
            data: bookings
          };
        });
      }



    });

    return sortedBookings;
  }

  static createBooking(booking) {
    const result = new Booking(
      booking.departureDate,
      booking.departureTime,
      booking.routeId,
      booking.purposeId,
      booking.bookingUnit,
      booking.serviceProviderType,
      booking.numPassenger,
      booking.vehicles,
      booking.bookingType,
      booking.scheduleId,
      booking.advancedNotice,
      booking.SAFFeedback,
      booking.SPFFeedback
    );
    result.bookingCode = booking.bookingCode;
    result.displayUserName = booking.displayUserName;
    result.purposeShort = booking.purposeShort;
    result.routeName = booking.routeName;
    result.status = booking.status;
    result.totalLoad = booking.totalLoad;
    result.remarks = booking.remarks;
    result.feedback = booking.SAFFeedback;
    result.BookingIssue = booking.BookingIssue;
    result.bookingGroup = booking.bookingGroup;
    result.cancellationReason = booking.cancellationReason;
    result.rejectedReason = booking.rejectedReason;
    result.feedbackType = booking.feedbackType;
    result.comments = booking.comments;
    result.rating = booking.rating;
    result.findings = booking.findings;
    result.onBoardTime = booking.onBoardTime;

    return result;
  }

}

export { ServiceProviderTypes, BookingTypes, BookingStatus };

