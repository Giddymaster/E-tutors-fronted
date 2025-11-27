import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to E-Tutors</h1>
            <p className="text-lg mb-8">Connect with verified tutors and enhance your learning experience.</p>
            <div className="flex space-x-4">
                <a href="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Get Started</a>
                <a href="/login" className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Login</a>
            </div>
        </div>
    );
};

export default Home;