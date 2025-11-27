import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileCard from '../components/ProfileCard';
import BookingCard from '../components/BookingCard';

const TutorDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="tutor-dashboard">
            <h1>Welcome, {user?.name}</h1>
            <ProfileCard user={user} />
            <h2>Your Bookings</h2>
            {/* Here you would map through the tutor's bookings and render BookingCard components */}
            <BookingCard />
        </div>
    );
};

export default TutorDashboard;