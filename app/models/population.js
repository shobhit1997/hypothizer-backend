var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var populationSchema = new Schema({

  year: { type: Number},

  population:    { type: Number},

  growth_rate: { type: String},

  growth: { type: Number }
});

module.exports = mongoose.model('Population', populationSchema);