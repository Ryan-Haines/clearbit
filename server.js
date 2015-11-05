console.log("Starting server...");
// Load the necessary servers.
var sys = require( "sys" );
var http = require( "http" );
//make sure we have our API key
var clearbit = require('clearbit')(APIKEY);//requires valid API key
var Person = clearbit.person;
var emailSearch ='';

// Create our HTTP server.
var server = http.createServer(
  function( request, response ){
  console.log("request: ");
  console.log(request);
  emailSearch=(request.url).substring(2, request.url.length);
  console.log("email " +emailSearch);

  var personFields = [];

  // Create a SUPER SIMPLE response.
  response.writeHead( 200, {
     "content-type": "text/plain",
     "Access-Control-Allow-Origin":"*"
  } );

  //perform our lookup
  clearbit.Person.find({email: emailSearch})
  .then(function (person) {
    personFields.push('First name:' + person.name.givenName);
    personFields.push('Last name:' + person.name.familyName);
    personFields.push('email:' + emailSearch);
    personFields.push('employer:' + person.employment.name);
    personFields.push('website:' + person.site);
    personFields.push('city:' + person.city);
    personFields.push('state:' +person.state);
    //no predefined values for street, zip, or industry
    console.log(personFields);
    response.write('' + personFields);
    response.end();
  })
  .catch(clearbit.Person.QueuedError, function (err) {
    // Lookup is queued - try again later
    console.log("Lookup queued - server busy");
    console.log(err);
    response.write('Lookup queued - server busy: try again later');
    response.end();
  })

  .catch(clearbit.Person.NotFoundError, function (err) {
    // Person could not be found
    console.log("Person not found");
    console.log(err);
    response.writeHead(404);
    response.write("NOTFOUND");
    response.end();
  })
  .catch(function (err) {
    console.error(err);
    response.writeHead(404);
    response.write("UNHANDLED EXCEPTION");
    response.end();
  });

  }
);

// Point the HTTP server to port 8080.
server.listen( 8080 );

// For logging....
console.log("Server is running on 8080");