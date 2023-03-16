import mongoose, { ConnectOptions } from 'mongoose';

// db connecting
const MONGO_URL = process.env.MONGO_URL;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions;

mongoose.set('strictQuery', false);

const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URL as string, connectOptions);

        console.log('MongoDB connection');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDatabase;
