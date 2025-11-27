import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed users
    const user1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: 'hashed_password_1',
            role: 'student',
            verification_status: true,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password_hash: 'hashed_password_2',
            role: 'tutor',
            verification_status: true,
        },
    });

    // Seed tutor profile
    await prisma.tutorProfile.create({
        data: {
            user_id: user2.id,
            short_bio: 'Experienced Math Tutor',
            hourly_rate: 30,
            availability: ['Monday', 'Wednesday', 'Friday'],
        },
    });

    console.log({ user1, user2 });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });