import moment from 'moment'
import Bookings from '../json_placeholder/Details1.json'
import AwsData from './AwsData';
//import { cos } from 'react-native-reanimated';
//import { Switch } from 'react-native-gesture-handler';

const awsData = new AwsData();    

function gettime(Results)
{
const date = new Date();
let BookingsData = JSON.parse(awsData.unitJsonBody);
let bookings = Object.entries(BookingsData).map(([_, booking]) => booking);

  switch(Results){
     case "Upcoming": 
        bookings = bookings.filter(booking=>{
            var a = moment(date);
            var b = moment(new Date(booking.BookingDate));
          return b.diff(a)>0
        } );
        break;

    case "Past":
        bookings = bookings.filter(booking=>{
            var a = moment(date);
            var b = moment(new Date(booking.BookingDate));
          return b.diff(a)<0 && b.diff(a,'hours')>-48
        } );
        break;
        case "Pending":
        bookings = bookings.filter(booking=>booking.Status === "REQUESTED");
        break;

        case "Rejected": 
        bookings = bookings.filter(booking=>booking.Status === "REJECTED");
        break;




  }

    //bookings = filterBookings(bookings, [ date]);
    bookings = sortBookings(bookings, [date]);

    return bookings;

}

/*function filterBookings(bookings, filter)
{
    const [date] = filter;
    const day = getMomentDay(date);

    const filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.BookingDate);
        const bookingDay = getMomentDay(bookingDate);
        const daysLeft = bookingDay.diff(day, "days");

        return daysLeft >= 0;
    });

    return filteredBookings;
}*/


function sortBookings(bookings, sort)
{
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

        if (!bookingsByDay[bookingDay])
        {
            bookingsByDay[bookingDay] = [booking];
        }
        else
        {
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

function getRelativeTimeFromNow(bookingDate, date)
{
    const bookingDay = getMomentDay(bookingDate);
    const day = getMomentDay(date);
    const daysUntilDeparture = bookingDay.diff(day, "days");

    let relativeTime = "";

    switch (daysUntilDeparture)
    {
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

function getMomentDay(date)
{
    return moment([
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ]);
}

function sortBookingsByServiceProviderType(sortedBookings)
{
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

        section["data"] = entries.map(entry => {
            const [serviceProviderType, bookings] = entry;
            return {
                serviceProviderType,
                data: bookings
            };
        });
    });
}

export default gettime;




function gettime1(BookingDate, CurrentDate)
{

  const datevariable = new Date(BookingDate);
  const Time  = moment(datevariable).format("DD MMM");

  var a = moment([datevariable.getFullYear(), datevariable.getMonth(), datevariable.getDate()]);
  var b = moment([CurrentDate.getFullYear(),CurrentDate.getMonth(), CurrentDate.getDate()]);
  const difference =  a.diff(b, 'days')
  let relativeTime = "";
  switch (difference)
  {
      case 0:
          relativeTime = "TODAY";
          break;
      case 1:
          relativeTime = "TOMORROW";
          break;
      default:
          break;
  }
  return `${relativeTime} ${Time}`.trim()
  

}
