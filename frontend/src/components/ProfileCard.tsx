import React from 'react';

interface ProfileCardProps {
    name: string;
    bio: string;
    hourlyRate: number;
    availability: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, bio, hourlyRate, availability }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-600">{bio}</p>
            <p className="text-lg font-semibold">Hourly Rate: ${hourlyRate}</p>
            <p className="text-sm text-gray-500">Availability: {availability}</p>
        </div>
    );
};

export default ProfileCard;