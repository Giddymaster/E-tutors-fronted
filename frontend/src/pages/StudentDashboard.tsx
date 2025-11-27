import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileCard from '../components/ProfileCard';
import BookingCard from '../components/BookingCard';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
            <ProfileCard user={user} />
            <h2 className="text-xl font-semibold mt-6">Your Bookings</h2>
            {/* Here you would map through the user's bookings and render BookingCard components */}
            <div className="grid grid-cols-1 gap-4 mt-4">
                {/* Example BookingCard component */}
                <BookingCard booking={{ id: 1, tutorName: 'John Doe', date: '2023-10-01', time: '10:00 AM' }} />
                {/* Add more BookingCard components as needed */}
            </div>
        </div>
    );
};

export default StudentDashboard;