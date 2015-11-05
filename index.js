$(document).ready(function() {


   //Given an identifier such as "First Name:" and response data, parse the field
   function parseField(identifier, data){
      var myData = data;  //mutation safety;
      var index = myData.indexOf(identifier);
      myData = myData.substring(index);
      var commaIndex = myData.indexOf(',');
      //special case for final field w/o comma
      if(commaIndex == -1){
        commaIndex = myData.length;
      }
      var parse = myData.substring(identifier.length, commaIndex);
      if(parse != null && parse != "null" && parse != "undefined" && parse != undefined)
        return parse;
      else{
        console.log("Parsed a null value");
        return ''; 
      }
   }
  
   var emailLookup =''; 
   var personFound = false;
   var lookupResult = '';

   var firstName ='';
   var lastName = '';
   var company = '';
   var url = '';
   var street = ''; //not explicitly in clearbit
   var city = '';
   var state = '';
   var zip = ''; //not explicitly in clearbit

  //clicking button performs our desired email lookup
  $("#emailLookup").click(function() {
    emailLookup = $("#searchTerm").attr("value"); //assign email to look for
    $.ajax({
      //change URL to current ec2 DNS
      url: 'http://ec2-52-32-85-138.us-west-2.compute.amazonaws.com',
      type: 'GET',
      async: false,
      data: emailLookup, // or $('#myform').serializeArray()
      success: function(data) { 
        console.log('GET completed for ' + emailLookup);
        lookupResult = data; 
      }
    });
    console.log("lookup result: " + lookupResult);

    /*
    //Parser Debugging
    console.log(firstName);
    console.log(lastName);
    console.log(company);
    console.log(url);
    console.log(city);
    */

    firstName = parseField("First name:", lookupResult);
    lastName = parseField("Last name:", lookupResult);
    company = parseField("employer:", lookupResult);
    url = parseField("website:", lookupResult);
    city = parseField("city:", lookupResult);
    state = parseField("state:", lookupResult);


    $("#newUser").show();
    $("#first_name").val(firstName);
    $("#last_name").val(lastName);
    $("#email").val(emailLookup);
    $("#company").val(company);
    $("#URL").val(url);
    //ignore industry for now
    $("#street").val(street);
    $("#city").val(city);
    $("#state").val(state);
    $("#zip").val(zip);

    alert("Please complete form and submit");
  });
});