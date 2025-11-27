import React from 'react';

interface BookingCardProps {
    tutorName: string;
    subject: string;
    date: string;
    time: string;
    duration: number; // in minutes
    price: number; // price per session
}

const BookingCard: React.FC<BookingCardProps> = ({ tutorName, subject, date, time, duration, price }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold">{tutorName}</h2>
            <p className="text-gray-700">Subject: {subject}</p>
            <p className="text-gray-700">Date: {date}</p>
            <p className="text-gray-700">Time: {time}</p>
            <p className="text-gray-700">Duration: {duration} minutes</p>
            <p className="text-gray-700">Price: ${price.toFixed(2)}</p>
        </div>
    );
};

export default BookingCard;