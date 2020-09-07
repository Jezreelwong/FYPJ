"use strict";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LENGTH = 6;

function generateBookingId()
{
    let bookingId = "";

    for (let i = 0; i < LENGTH; i++)
    {
        const random = Math.random();
        const index = Math.floor(random * CHARS.length);
        const char = CHARS.charAt(index);
        bookingId += char;
    }

    return bookingId;
}

export default generateBookingId;
