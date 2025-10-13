import mongoose from 'mongoose';

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    throw err;
  }
};

export default ConnectDB;
