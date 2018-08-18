var mongoose = require('mongoose');
const _ 	=	require('lodash');
var Schema = mongoose.Schema;

var populationSchema = new Schema({

  year: { type: Number},

  population:    { type: Number},

  growth_rate: { type: String},

  growth: { type: Number }
});
populationSchema.methods.toJSON=function(){
	var population=this;
	var  populationObject= population.toObject();

	return _.pick(populationObject,['_id','year','population','growth_rate','growth']); 
}

module.exports = mongoose.model('Population', populationSchema);