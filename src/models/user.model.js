import mongoose, { Schema } from "mongoose";

const collection = "users";

const documentSchema = new mongoose.Schema({
  name: String,
  reference: String,
});

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  roll: {
    type: String,
    default: "user",
    enum: ["user", "admin", "premium"],
  },
  resetToken: String,
  resetTokenExpires: Date,
  documents: [documentSchema],
  last_connection: Date,
  profilePhoto: String,
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
});

const userModel = mongoose.model(collection, schema);

export default userModel;
