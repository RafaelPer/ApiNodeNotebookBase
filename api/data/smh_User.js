const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const User = new Schema({
  //userID: String,
  //username: String,
  username: {
    type: String,
    unique: true
  },
  nome: String,
  sobrenome: String,
  email: String,
  senha: String,
  celular: String,
  isActive: Boolean,
  dispositivo: String,
  issync: Boolean,
  date: Date
});

mongoose.model('smh_User', User)