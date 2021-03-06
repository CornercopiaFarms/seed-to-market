var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
// var pg = require( 'pg' );
//
// // set up config for the pool
// var config = {
//   database: 'seed-to-market',
//   host: 'localhost',
//   port: 5432,
//   max: 10
// }; // end config
//
// // setup new pool
// var pool = new pg.Pool( config );
var pool = require('../modules/pool');

router.post('/addSeed', function(req, res) {
  console.log('in inventory addSeed with -->', req.body);
  if (req.isAuthenticated()) {
    //query to add new seed to database
    pool.connect(function(err, connection, done) {
      if (err) {
        res.send(400);
      } else {
        console.log('connected to db');
        connection.query("INSERT INTO seeds (" +
          "crop, variety, purchase_date, lot_number, quantity, item_code,supplier_id, organic, untreated, non_gmo, seed_check_sources, receipt_url, user_id )" +
          "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", [req.body.crop, req.body.variety, req.body.purchase_date, req.body.lot_number, req.body.quantity, req.body.item_code, req.body.supplier_id, req.body.organic, req.body.untreated, req.body.non_gmo, req.body.seed_check_sources, req.body.receipt_url, req.user.user_id]);
        done(); //close connection
        res.sendStatus(200);
        //end response of success if user logged in and new seed added
      }
    });
  } else {
    res.sendStatus(403);
  } // end response if user not authenticated
}); //end of POST route for adding new seed

router.get('/', function(req,res) {
  console.log('in inventory getSeeds');
  //array to save seed inventory from db
  var seedInventory = [];
  if (req.isAuthenticated()) {
    pool.connect(function(err, connection, done) {
      if (err) {
        res.send(400);
      } else {
        console.log('connected to db');
        var resultSet = connection.query("SELECT * FROM seeds INNER JOIN suppliers ON seeds.supplier_id=suppliers.supplier_id WHERE seeds.user_id=$1", [ req.user.user_id ]);
        resultSet.on( 'row', function( row ){
        seedInventory.push( row );
      });
        resultSet.on( 'end', function(){
         done();
         res.send( seedInventory );
       }); //end on end
     } // end no error
   }); //end pool
 } else {
   res.sendStatus(403);
 }
});//end get

//edit seed PUT
router.put('/editSeed', function(req, res){
console.log('in router PUT for edit seed', req.query);
  var newSeed = req.query;
  if (req.isAuthenticated()) {
    pool.connect(function(err, connection, done) {
      if (err) {
        res.send(400);
      } else {
          connection.query("UPDATE seeds SET crop = $1 , variety = $2 , purchase_date = $3 , lot_number = $4 , quantity = $5 , item_code = $6 , supplier_id = $7 , organic = $8 , untreated = $9 , non_gmo = $10 , seed_check_sources = $11 , receipt_url = $12 WHERE seed_id=$13 ", [req.query.crop, req.query.variety, req.query.purchase_date, req.query.lot_number, req.query.quantity, req.query.item_code, req.query.supplier_id, req.query.organic, req.query.untreated, req.query.non_gmo, req.query.seed_check_sources, req.query.receipt_url, req.query.seed_id]);

        done();
        res.sendStatus(200);
      } //end else
    }); //end pool
  } else {
    res.sendStatus(403);
  }
});//end PUT

module.exports = router;
