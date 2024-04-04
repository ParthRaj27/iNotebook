// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  user :{
    // works like a foreign key in normal sqli
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  title:{
    type:String,
    require:true
  },
  description:{
    type:String,
    require:true
  },
  tag:{
    type:String,
    default:"General"
  },

  date:{
    type:Date,
    default:Date.now
  }
  
});

module.exports = mongoose.model('notes', notesSchema);