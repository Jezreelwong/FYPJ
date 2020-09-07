"use strict"

import Bookings from "../json_placeholder/Details.json";

function getBookings(bookingType)
{
    let bookings = Object.entries(Bookings).map(([_, booking]) => booking);
    bookings = sortBookings(bookings, [bookingType])
    
    return bookings;
}

function sortBookings(bookings)
{
    const sortBookings = sortBookingsByBookingResults(sortBookings);

    return sortedBookings;
}

function sortBookingsByBookingResults(sortedBookings)
{
    sortedBookings.forEach(section => {
        const bookingResult = {
            "Approved":[],
            "Pending": [],
            "Rejected" : [],

        };

        const bookings = section.data;
        bookings.forEach(booking =>{bookingResult[booking.status].push(booking);});
        
        const entries = Object.entries(bookingResult);

        section["data"] = entries.map(entry => {
            const [status, bookings] = entry;
            return{
                status,
                data:bookings
            };
        })
    });
}
export default getBookings;