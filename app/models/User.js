import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  username: { type: String, required: true, unique: true },
  profilepic: { type: String },
  coverpic: { type: String },
  razorpayid: { type: String },
  razorpaysecret: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure indexes are created
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);