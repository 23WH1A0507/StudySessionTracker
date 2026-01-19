const { seedDatabase } = require('./seed');
const { connectDB, disconnectDB } = require('./utils/Connect');

const User = require('./models/User');
const StudySession = require('./models/Session');

const displayMessage = async () => {
    console.log("Database seeding completed successfully.");

    try {
        await connectDB();

        console.log("The users are");
        const users = await User.find({});
        users.forEach(user => {
            console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
        });

        console.log("\nThe study sessions are");
        const sessions = await StudySession.find({})
            .populate('userId', 'name email');

        sessions.forEach(session => {
            console.log(
                `Subject: ${session.subject}, ` +
                `Duration: ${session.duration}, ` +
                `Student: ${session.userId.name}`
            );
        });

        await disconnectDB();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

const startApp = async () => {
    await seedDatabase();
    await displayMessage();
};

startApp();
