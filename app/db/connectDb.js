import mongoose from "mongoose";
const connectDb = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://alokchaturvedi190:tSfG3cshendvz6os@cluster0.ww8zb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  export default connectDb