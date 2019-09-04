let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongodb = require("mongodb");
let ObjectId = mongodb.ObjectId;
let app = express();
let router = express.Router();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use("/images",express.static('images'));
app.use("/css",express.static('css'));
app.use(bodyParser.urlencoded({
    extended: false
}));
let MongoClient = mongodb.MongoClient;
let url = "mongodb://localhost:27017/";
let db;
//The MongoDB Node.js driver rewrote the tool it uses to parse MongoDB connection strings.
//Because this is such a big change, they put the new connection string parser behind a flag.
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });



router.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
  
router.get('/newTask', function (req,res) {
    res.sendFile(__dirname + "/views/newTask.html");
});
  
router.get('/listTasks', function(req, res){
    let filename = __dirname + "/views/listTasks.html";
    db.collection('lab6').find({}).toArray(function (err, result) {
        res.render(filename, {
            database:result
        });
    });
});

router.post("/addTask", function (req, res) {
    db.collection('lab6').insertOne(req.body, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/deleteOneTask", function (req, res) {
    let deleteid = req.body.TaskID;
    db.collection('lab6').deleteOne({ _id: ObjectId(deleteid)}, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/deleteAllTask", function (req, res) {
    db.collection('lab6').deleteMany({}, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/addTask", function (req, res) {
    db.collection('lab6').insertOne(req.body, function(err, result){
        res.redirect('listTasks');
    });
});


router.get("/delete", function(req,res){
    res.sendFile(__dirname + "/views/delete.html");
});

router.get("/update", function(req,res){
    res.sendFile(__dirname + "/views/update.html");
});

router.post("/update", function(req,res){
    let myid = req.body.TaskID;
    let mytaskstate = req.body.TaskStatus;
    db.collection('lab6').updateOne({_id: ObjectId(myid)}, {$set:{TaskStatus:mytaskstate}}, (err, result)=>{
        res.redirect('listTasks');
    });
});


app.use('/', router);
app.listen("8080");