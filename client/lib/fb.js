// You probably don't want to use globals, but this is just example code
  var fbAppId = '173412099374898';
  //var objectToLike = 'http://techcrunch.com/2013/02/06/facebook-launches-developers-live-video-channel-to-keep-its-developer-ecosystem-up-to-date/';

  // This is boilerplate code that is used to initialize the Facebook
  // JS SDK.  You would normally set your App ID in this code.

  // Additional JS functions here
/*  window.fbAsyncInit = function() {
    FB.init({
      appId      : fbAppId,        // App ID
      status     : true,           // check login status
      cookie     : true,           // enable cookies to allow the server to access the session
      xfbml      : true            // parse page for xfbml or html5 social plugins like login button below
    });

    // Put additional init code here
  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));*/

  /*
   * This function makes a call to the og.likes API.  The object argument is
   * the object you like.  Other types of APIs may take other arguments.
   * (i.e. the book.reads API takes a book= argument.)
   *
   * Because it's a sample, it also sets the pr ivacy parameter so that it will
   * create a story that only you can see.  Remove the privacy parameter and
   * the story will be visible to whatever the default privacy was when you
   * added the app.
   *
   * Also note that you can view any story with the id, as demonstrated with
   * the code below.
   *
   * APIs used in postLike():
   * Call the Graph API from JS:
   *   https://developers.facebook.com/docs/reference/javascript/FB.api
   * The Open Graph og.likes API:
   *   https://developers.facebook.com/docs/reference/opengraph/action-type/og.likes
   * Privacy argument:
   *   https://developers.facebook.com/docs/reference/api/privacy-parameter
   */

 /* function postLike() {
    FB.api(
       'https://graph.facebook.com/me/og.likes',
       'post',
       { object: objectToLike,
         privacy: {'value': 'SELF'} },
       function(response) {
         if (!response) {
           alert('Error occurred.');
         } else if (response.error) {
           document.getElementById('result').innerHTML = 'Error: ' + response.error.message;
         } else {
           document.getElementById('result').innerHTML =
             '<a href=\"https://www.facebook.com/me/activity/' + response.id + '\">' +
             'Story created.  ID is ' + response.id + '</a>';
         }
       }
    );
 }


  function postCreate() {
    FB.api(
       'https://graph.facebook.com/me/knacked:create',
       'post',
       { object: "http://localhost:3000/" + Session.get("selected"),
         privacy: {'value': 'SELF'} },
       function(response) {
         if (!response) {
           alert('Error occurred.');
         } else if (response.error) {
           document.getElementById('result').innerHTML = 'Error: ' + response.error.message;
         } else {
           document.getElementById('result').innerHTML =
             '<a href=\"https://www.facebook.com/me/activity/' + response.id + '\">' +
             'Story created.  ID is ' + response.id + '</a>';
         }
       }
    );
 }

*/