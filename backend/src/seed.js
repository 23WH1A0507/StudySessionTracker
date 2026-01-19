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

        // Seed Users
        const users = await User.create([
            {
                name: 'Alice Student',
                email: 'alice@student.college.edu',
                role: 'student'
            },
            {
                name: 'Bob Student',
                email: 'bob@student.college.edu',
                role: 'student'
            },
            {
                name: 'Admin User',
                email: 'admin@college.edu',
                role: 'admin'
            }
        ]);

        // Seed Study Sessions
        await StudySession.create([
            {
                userId: users[0]._id,
                subject: 'Data Structures',
                duration: 120,
                date: new Date('2023-10-15')
            },
            {
                userId: users[0]._id,
                subject: 'Operating Systems',
                duration: 90,
                date: new Date('2023-10-16')
            },
            {
                userId: users[1]._id,
                subject: 'Database Management Systems',
                duration: 100,
                date: new Date('2023-10-17')
            }
        ]);

        console.log('Database seeded successfully');
        await disconnectDB();
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = { seedDatabase };
