import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },

});

userSchema.index({ email: 1 }, { unique: true });

const users = mongoose.model('Users', userSchema);
module.exports = users