import mongoose from 'mongoose'

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB', "The connection has been completed to MongoDB")
    }catch (error) {
        console.error(error, "There is a problem connecting to MongoDB")
    }
}

export default connectDb;
