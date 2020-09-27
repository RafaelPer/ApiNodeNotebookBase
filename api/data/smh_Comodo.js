const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const Comodo = new Schema({
  //userID: String,
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'smh_Users'
  },
  //userName: String,
  //comodoID: String,
  nomeComodo: String,
  tempComodo: String,
  umiComodoF: String,
  ajustTempComodo: String,
  statusLuzComodo: Boolean,
  statusTomadaComodo: Boolean,
  statusJanelaComodo: Boolean,
  statusPortaComodo: Boolean,
  statusPresencaComodo: Boolean,
  statusArCondiconado: Boolean,
  isActive: Boolean,
  // isFavorite: {
  //   type: Boolean,
  //   unique: true
  // },
  isFavorite: Boolean,
  isPareado: Boolean,
  dispPareado: String,
  issync: Boolean,
  date: Date
});

mongoose.model('smh_Comodo', Comodo)