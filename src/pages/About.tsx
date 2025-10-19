
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function About() {
	return (
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h3" component="h1" gutterBottom>
					About Excellent Tutors
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Excellent Tutors is dedicated to helping students achieve their academic goals by connecting them with experienced, passionate educators. Our platform offers personalized lessons, transparent pricing, and verified tutor profiles to ensure a safe and effective learning environment. Whether you need help with math, science, languages, or test preparation, we make it easy to find the right tutor for your needs. We believe in empowering learners of all ages and backgrounds, fostering growth, confidence, and lifelong success. Join our community and discover how Excellent Tutors can support your journey to excellence.
				</Typography>
			</Box>
			{/* ...existing code... */}
		</Container>
	);
}
