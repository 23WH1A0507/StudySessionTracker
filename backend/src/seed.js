const { connectDB, disconnectDB } = require('./utils/Connect');

const User = require('./models/User');
const StudySession = require('./models/Session');

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected to the database');

        // Clear existing data
        await User.deleteMany({});
        await StudySession.deleteMany({});

        // Seed Users (default password for all seeded users: Password123!)
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@college.edu',
                password: 'Password123!',
                role: 'admin'
            }
        ]);

        // Seed Study Sessions (admin only)
        await StudySession.create([
            {
                userId: users[0]._id,
                subject: 'Admin Management Review',
                duration: 60,
                date: new Date('2023-10-15')
            }
        ]);

        console.log('Database seeded successfully');
        await disconnectDB();
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

// Run seed if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
