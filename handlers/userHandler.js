const UserSchema = require
("../models/userSchema.js");
const mongoose = require("mongoose");

exports.addUser = function(req, res) {
  console.log();
  console.log('ADD user requested...');
  console.log(req.body);

  UserSchema.findOne( {username: req.body.username}, function(err, data) {
    if (err) return console.log();

    if (data) {
      return res.json( {"Error": "Sorry, but username already exists in the database. Please chose different username and try again."} );
    } else {
        let newUser = new UserSchema({
          username: req.body.username
        });

        newUser.save(function(err, data) {
          if (err) return console.log("Error saving newUser to DB:", err);

          console.log("Saving new user " + data._id + " to DB... " + new Date().toDateString())

          return res.json({
            username: data.username,
            _id: data._id
          });
        }); // END of newUser.save()
    }; // END of else statement

  }); // END of UserEntry.findOne() 
}; // END of exports addUser()

exports.getAllUsers = function(req, res) {
  UserSchema.find(function(err, data) {
    if (err) return console.log("Error finding all users:", err);

    if (data.length > 0) {
      return res.json( data );
    } else {
      return res.json( {"Error": "There are currently no users in the database."} );
    };

  }); // END of UserEntry,find()
}; // END of exports.getAllUsers()

exports.addExercise = function(req, res) {
  console.log();
  console.log('POST exercise requested...');
  console.log(req.body);

  let id = req.params._id;
  
  /* if ( !mongoose.Types.ObjectId.isValid( _id ) ) {
    return res.json( {"Error": "'" + _id + "' is not a valid ID format. Please check to make sure that you have the right ID and try again."} );
  }; */
    
    UserSchema.findById( id, function(err, data) {
      if (err) return console.log("Error checking for matching _id in user collection:", err);
      
      if(!data) {
        return res.json( {"Error": "That user ID doesn't exist in the database. Please check to make sure that you have the right ID and try again."} );
      } else {
              
        console.log("User " + id + " found, creating exercise... " + new Date().toDateString());

        if (req.body.date) {
          date = new Date(req.body.date).toDateString();

          
        } else {
          date = new Date().toDateString();
           
          }
        
        let newExercise = new UserSchema({
            username: data.username,
            log: [ 
              {
                description: data.description,
                duration: data.duration,
                date: date
              },
            ],
        });
            
          console.log("Saving to DB... " + newExercise + ' ' + new Date().toDateString());
          
          if (err)  {
          console.log("Error while saving new exercise:", err);
          return res.json ({ err });
          }
          
          newExercise.count++;
          console.log(newExercise);
          newExercise.log.push({
            description: data.description,
            duration: data.duration,
            date: date
            });
          newExercise.save();

          return res.json ( {
            username: data.username,
            description: data.description,
            duration: data.duration,
            _id: id,
            date: date
          });
          
        
        
      }; // END of else statement
    }); // END of UserEntry.findById()
  }; // END of exports.addExercise()


exports.getAllExercises = function(req, res) {
  console.log('')
  console.log('GET all exercises requested for a user ' + req.params._id + ' ...');
  console.log(req.params);
  console.log(req.query);

  let _id = req.params["_id"];
  let fromDate;
  let toDate;
  let limit;
  
    if (req.query.from) {
    fromDate = new Date(req.query.from)
  } else {
    fromDate = new Date("0001-01-01").toDateString();
  };

  if (req.query.to) { 
    toDate = new Date(req.query.to)
  } else {
    toDate = new Date("2059-12-31").toDateString();
  };

  if ( isNaN(fromDate) && req.query.from ) return res.json( {"Error": "The 'from' date is not in a valid date format. Please try again with a date in YYYY-MM-DD format."} );
  if ( isNaN(toDate) && req.query.to ) return res.json( {"Error": "The 'to' date is not in a valid date format. Please try again with a date in YYYY-MM-DD format."} );

    if (fromDate > toDate) return res.json( {"Error": "The submitted 'from' date is more recent than the 'to' date. Please check the dates and try again."} );

    if ( isNaN(0 + req.query.limit) && req.query.limit ) {
    return res.json( {"Error": "The limit parameter of this query (limit = " + req.query.limit + ") is not correcly set. Please make sure that it is an integer and try again."} );
    } else {
    // If req.query.limit is a number, we'll convert it from its current state as a JSON/URL string into an Integer and save it. 
    limit = parseInt(req.query.limit);
  };  
 
    if ( !mongoose.Types.ObjectId.isValid(_id) ) {
      return res.json( {"Error": "User ID '" + _id + "' is not a valid ID format. Please check to make sure that you have the right ID and try again."} );
    };
    
    UserSchema.findById( _id, function(err, data) {
      if (err) return console.log("Error while trying to find matching username:", err);
      
      if (!data) {
        return res.json( {"Error": "That user ID doesn't exist in the database. Please check to make sure that you have the right ID and try again."} );
        
      } else {
        let username = data.username;
        
        UserSchema
          .find({
            username: username,
            date: {$gte: fromDate, $lte: toDate}
          })
          .select("description duration date -_id")
          .limit( limit)
          .exec(function(err, data) {
            if (err) return console.log("Error searching exercises for username '" + username + "' with error:", err);
          
          if (data.length > 0) {
            return res.json( {
              username: username,
              _id: _id,
              count: data.length,
              log: data 
            });
          } else {
            UserSchema.find ( {username: username}, function(err, data) {
              if (err) return console.log("Error:", err);
              
              if (data.length > 0) {
                return res.json( {"Error": "User " + username + " (user ID: " + _id + ") has saved exercise, but none that match the search parameters."} ); 
              } else {
                return res.json( {"Error": "User " + username + " (user ID: " + _id + ") doesn't have any exercises saved yet."} ); 
              }
            });
          
          } // END of else statement
            
          }); // END of UserExercise.find 
      }; // END of else statement for checking if the _id has a matching username (and therefore a valid _id)
    }); // ENd of UserEntry.findById()
    
}; // END of exports.getAllExercises()