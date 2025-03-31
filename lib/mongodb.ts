import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

export const connectDB = async () => {
	try {
		if (mongoose.connection.readyState !== 1) {
			console.log("Attempting to connect to MongoDB...");
			await mongoose.connect(MONGODB_URI as string);
			console.log("========= Connected to MongoDB 🚀");
		} else {
			console.log("========= Already connected to MongoDB ✅");
		}
	} catch (error) {
		console.error("========= MongoDB connection failed ❌", error);
	}
};
