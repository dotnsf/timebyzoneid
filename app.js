//. app.js
var express = require( 'express' ),
    client = require( 'cheerio-httpcli' ),
    app = express();

var settings = require( './settings' );

app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

client.set( 'browser', 'chrome' );
client.set( 'headers', { 
  'Referer': settings.base_url + '/jo_sekai3.php'
});

//. CORS
if( settings && settings.cors && settings.cors.length && settings.cors[0] ){
  var cors = require( 'cors' );
  var option = {
    origin: function( origin, callback ){
      if( settings.cors.indexOf( origin ) > -1 ){
        callback( null, true );
      }else{
        callback( new Error( 'Not allowed by CORS' ) );
      }
    },
    optionSuccessStatus: 200
  };
  app.use( cors( option ) );
}

//. Search TimeZone
var zone_indexes = [];
client.fetch( settings.base_url + '/jo_sekai3.php', {}, 'UTF-8', function( err, $, res0, body0 ){
  if( err ){
    console.log( err );
  }else{
    $('div.tableContainer table tr').each( function(){
      var tds = $(this).find( 'td' );
      if( tds.length == 5 ){
        var zone_id = tds.eq( 0 ).find( 'a' ).text();
	var zone_link = settings.base_url + tds.eq( 0 ).find( 'a' ).attr( 'href' );
        var zone_name = tds.eq( 1 ).find( 'a' ).text();
        var zone_time = tds.eq( 2 ).find( 'span.time_format_24' ).text();
        var zone_diff_utc = tds.eq( 3 ).find( 'a' ).text();
        var zone_diff_gmt = tds.eq( 4 ).find( 'a' ).text();
	zone_indexes.push( { id: zone_id, name: zone_name, time: zone_time, diff_utc: zone_diff_utc, diff_gmt: zone_diff_gmt, link: zone_link } );
      }
    });
    console.log( zone_indexes );
  }
});


app.get( '/ping', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( { status: true, message: 'PONG' } ) );
  res.end();
});

app.get( '/', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( { status: true } ) );
  res.end();
});

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
