// import mongoose from "mongoose";

// const dbConnect = async () => {
//   if (mongoose.connections[0].readyState) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI as string);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw new Error("Failed to connect to MongoDB");
//   }
// };

// export default dbConnect;

import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds delay between retries

const dbConnect = async () => {
  // If already connected, return early
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to MongoDB");
    return;
  }

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string, {
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
      });
      console.log("Connected to MongoDB");
      return; // Successfully connected, exit the function
    } catch (error) {
      retries += 1;
      console.error(
        `MongoDB connection attempt ${retries}/${MAX_RETRIES} failed:`,
        error
      );

      if (retries === MAX_RETRIES) {
        console.error("Max retries reached. Failed to connect to MongoDB.");
        throw new Error("Failed to connect to MongoDB after multiple attempts");
      }

      // Wait before retrying
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

export default dbConnect;
