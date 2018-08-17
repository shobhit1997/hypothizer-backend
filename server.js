var express =	require('express');
var app		=	express();
var bodyParser = require('body-parser');
var mongoose	=	require('mongoose');
var Population 	=	require('./app/models/population');
var csv = require("fast-csv");
var fs = require('fs');
mongoose.connect('mongodb://shobhit:shobhit1997@ds117701.mlab.com:17701/feeds_app');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
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
			          res.send({success : "Data imported successfully.", status : 200});
			    });
			
		  
		    stream.pipe(csvStream);

		    
     
	});
app.use('/api',router);
app.use(express.static('./public'));



app.listen(port);
console.log('Running on Port '+ port);