import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING!, {
      dbName: "prueba_tecnica",
    });
  } catch (error) {
    console.error(error);
  }
};
