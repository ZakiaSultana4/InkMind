import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

interface Cached {
    connection: Mongoose | undefined;
    promise: Promise<Mongoose> | undefined;
}

const cached: Cached = { connection: undefined, promise: undefined };

export const connectToDatabase = async (): Promise<Mongoose> => {
    if (!MONGODB_URI) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }

    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: "blogAI",
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        cached.connection = await cached.promise;
    } catch (error) {
        cached.promise = undefined;
        throw error;
    }

    return cached.connection;
};