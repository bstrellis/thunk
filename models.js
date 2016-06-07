var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phoneNumber: Number
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

var ImageSchema = new mongoose.Schema({
  index: Number,
  url: String
});

var Thoughts = mongoose.model('Thought', ThoughtSchema);
var Users = mongoose.model('User', UserSchema);
var Sessions = mongoose.model('Session', SessionSchema);
var Images = mongoose.model('Image', ImageSchema);

exports.Thoughts = Thoughts;
exports.Users = Users;
exports.Sessions = Sessions;
exports.Images = Images;
