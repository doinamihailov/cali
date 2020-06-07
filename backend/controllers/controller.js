
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://user:pass@cluster0-ripl0.azure.mongodb.net/test?retryWrites=true&w=majority';

// retrieve all info
exports.findAll = (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for retrieving info");
    if(err)
      console.log(err);
    var dbase = db.db("cali");

    try {
      const results = dbase.collection('boards').find().toArray(function(err, result) {
        if (result.length > 0) {
          res.send(result);
        }
   });

   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error getting users"
      });
   }
  });
};


exports.create = (req, res) => {
  // validate request
  if (!req.body.id) {
    res.status(400).send({
      message: "Id can not be empty!"
    });
    return;
  }
  // create an item
  const board = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    information: req.body.information
  };

      //STORE IN MONGODB
      MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        console.log("Connected for create");
        if(err)
          console.log(err);
        var dbase = db.db("cali"); //here
        dbase.collection('boards').insertOne(board);
      });
      res.send("ok");
};

 exports.edit = (req, res) => {
  const board = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    information: req.body.information,
  };
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for editing");
    if(err)
      console.log(err);
    var dbase = db.db("cali");

    try {
      dbase.collection('boards').replaceOne( { 'id' : req.body.id}, board );
      res.send({
        message: "item was edited successfully."
      });
      
   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error editing user with email=" + req.body.email
      });
   }
  });
}

exports.delete = (req, res) => {

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for deleting item");
    if(err)
      console.log(err);
    var dbase = db.db("cali");

    try {
      dbase.collection('boards').deleteOne( { 'id' : req.body.id} );
      res.send({
        message: "item was deleted successfully."
      });
      
   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error deleting item with id =" + req.body.id
      });
   }
  });
}

