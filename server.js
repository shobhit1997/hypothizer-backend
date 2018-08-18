var express =	require('express');
var app		=	express();
var bodyParser = require('body-parser');
var mongoose	=	require('mongoose');
var Population 	=	require('./app/models/population');
var csv = require("fast-csv");
var fs = require('fs');
const _ 	=	require('lodash');
mongoose.connect('mongodb://localhost:27017/hypothizer');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,content-type, Accept , x-auth');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var port= process.env.PORT||8000;

var router = express.Router();

router.use(function(req, res, next) {

    console.log('Something is happening.');
    next(); 
});

console.log(__dirname);
var csvfile = __dirname + "/public/files/DelhiPopulationData.csv";

var stream = fs.createReadStream(csvfile);
router.get('/',function(req,res){
	res.json({message : 'welcome'});
});
router.route('/data')
	.get(function(req,res){
		Population.find().then(function(population){
			res.send(population);
		});
	})
	.post(function(req,res){
		console.log(req.body);
		var body=_.pick(req.body,['year','population','growth_rate','growth']);
		console.log(body);
		var population=new Population(body);
		population.save().then(function(data){
			res.send(data);
		}).catch(function(e){
			res.status(400).send();
		});
	})
	.put(function(req,res){
		Population.findByIdAndUpdate(req.body._id, {
	        year: req.body.year,
	        population: req.body.population,
	        growth_rate:req.body.growth_rate,
	        growth:req.body.growth
	    }).then(function(data){
	        if(!data) {
	           	res.status(404).send("Not found");
	        }
	        else{
	        	res.send(data);	
	        }
	        
	    }).catch(function(err) {
	        if(err.kind === 'ObjectId') {
	            res.status(404).send("Not found");                
	        }
	        else{
	        	res.status(500).send();
	        }
	    });
	});
router.route('/data/:id')
	.delete(function(req,res){
		Population.findByIdAndRemove(req.params.id).then(function(data){
			if(data){
				res.send(data);
			}
			else{
				res.status(404).send("Not found");
			}
		}).catch(function(e){
			res.send(404).send("Not found");
		});
	});
router.route('/import')
	.get(function(req,res){
		var  populationData  = []
    	var c=0;
		var csvStream = csv()
	        .on("data", function(data){
	         c++;
	        if(c>1){
		         var item = new Population({

		              year: data[0],

		              population: data[1],

		              growth_rate: data[2],

		              growth: data[3] 

		         });
		         
		          item.save(function(error){

		            console.log(item);

		              if(error){

		                   throw error;

		              }

		          }); 
		      }

			    }).on("end", function(){
			          console.log(" End of file import");
			          stream.close();
			          res.send({success : "Data imported successfully.", status : 200});
			    });
		    stream.pipe(csvStream);
	});
app.use('/api',router);
app.use(express.static('./public'));



app.listen(port);
console.log('Running on Port '+ port);