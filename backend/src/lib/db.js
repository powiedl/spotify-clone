import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log(
      'MONGO_URI connection string not available in the environment!'
    );
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB ${conn.connection.host}`);
  } catch (error) {
    console.log('Failed to connect to MongoDB:', error);
  }
};
