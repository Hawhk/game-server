const { MongoClient } = require( 'mongodb' );
const url = 'mongodb://localhost';

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url, { useUnifiedTopology: true }, function( err, client ) {
      _db  = client.db('visitors');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};