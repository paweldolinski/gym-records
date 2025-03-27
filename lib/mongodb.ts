import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

export const connectDB = async () => {
	try {
		// Sprawdź, czy już istnieje połączenie
		if (mongoose.connection.readyState !== 1) {
			await mongoose.connect(MONGODB_URI as string);
			console.log("========= Connected to MongoDB 🚀");
		} else {
			console.log("========= Already connected to MongoDB ✅");
		}

		return Promise.resolve(true);
	} catch (error) {
		console.error("========= MongoDB connection failed ❌", error);
		return Promise.reject(error);
	}
};
