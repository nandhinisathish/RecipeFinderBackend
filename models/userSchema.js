import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
  
 favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',  // Reference to the Favourite model
      }
    ]
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

export default User;