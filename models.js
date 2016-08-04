var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phoneNumber: Number,
  reminderTime: Number,
  reminderInterval: Number
});

var SessionSchema = new mongoose.Schema({
  cookieIDStr: String,
  userId: String
});

var ThoughtSchema = new mongoose.Schema({
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: mongoose.Schema.ObjectId
});

var Thoughts = mongoose.model('Thought', ThoughtSchema);
var Users = mongoose.model('User', UserSchema);
var Sessions = mongoose.model('Session', SessionSchema);

exports.Thoughts = Thoughts;
exports.Users = Users;
exports.Sessions = Sessions;
