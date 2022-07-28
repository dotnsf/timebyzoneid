//. settings.js

//. settings for CORS
exports.cors = ( 'CORS' in process.env ) ? process.env['CORS'].split( ',' ) : [];

exports.base_url = 'https://24timezones.com';

