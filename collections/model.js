knacktivity = new Meteor.Collection("knacktivity");
taxonomy = new Meteor.Collection("taxonomy");
//FileSystem = new CollectionFS("FileSystem");
FileSystem = new Meteor.Collection("FileSystem");


/*FileSystem.fileHandlers({
  small: function(options) {
   if (options.fileRecord.contentType != 'image/jpeg')
      return null; // jpeg files only  

    var dest = options.destination('jpg').serverFilename; // Set optional extension
    var gm = Npm.require('gm'); // GraphicsMagick required need Meteor package
    gm(options.blob, dest).resize(200,200).quality(90).write(dest, function(err) {
        if (err) {
           console.log('GraphicsMagick error ' + err);
          return false; 
          // False will trigger rerun, could check options.sumFailes
          // if we only want to rerun 2 times (default limit is 3,
          // but sumFailes is reset at server idle + wait period)
        }
        else {
          console.log('Finished writing image.');
          return options.destination('jpg').fileData; // We only return the url for the file, no blob to save since we took care of it
        }
      });
    
    // I failed to deliver a url for this, but don't try again
    return null;

  },
  medium: function(options) {
   if (options.fileRecord.contentType != 'image/jpeg')
      return null; // jpeg files only  
  
    var dest = options.destination('jpg').serverFilename; // Set optional extension
    console.log(dest);
    var gm = Npm.require('gm'); // GraphicsMagick required need Meteor package
    gm(options.blob, dest).resize(400,400).quality(90).write(dest, function(err) {
        if (err) {
           console.log('GraphicsMagick error ' + err);
          return false; 
          // False will trigger rerun, could check options.sumFailes
          // if we only want to rerun 2 times (default limit is 3,
          // but sumFailes is reset at server idle + wait period)
        }
        else {
          console.log('Finished writing image.');
          return options.destination('jpg').fileData; // We only return the url for the file, no blob to save since we took care of it
        }
      });
    
    // I failed to deliver a url for this, but don't try again
    return null;

  },
  large: function(options) {
   if (options.fileRecord.contentType != 'image/jpeg')
      return null; // jpeg files only  
 
    var dest = options.destination('jpg').serverFilename; // Set optional extension
    console.log(dest);
    var gm = Npm.require('gm'); // GraphicsMagick required need Meteor package
    gm(options.blob, dest).resize(800,800).quality(90).write(dest, function(err) {
        if (err) {
           console.log('GraphicsMagick error ' + err);
          return false; 
          // False will trigger rerun, could check options.sumFailes
          // if we only want to rerun 2 times (default limit is 3,
          // but sumFailes is reset at server idle + wait period)
        }
        else {
          console.log('Finished writing image.');
          return options.destination('jpg').fileData; // We only return the url for the file, no blob to save since we took care of it
        }
      });
    
    // I failed to deliver a url for this, but don't try again
    return null;
  }
});*/





FileSystem.allow({
  insert: function(userId, myFile) { return userId && myFile.owner === userId; },
  update: function(userId, files, fields, modifier) {
    return _.all(files, function (myFile) {
      return (userId == myFile.owner);

        });  //EO interate through files
  },
  remove: function(userId, files) { return true; }
});


displayName = function (user) {
  if (user != undefined && user.profile && user.profile.name)
    return user.profile.name;
  return  "<a href ='javascript:void(0)' class='userInfo' id='"+ user._id +"'>" + user.emails[0].address + "</a>";
};

displayNameRaw = function (user) {
  if(user == undefined)
    return;
  if (user.profile != undefined){
    if(user.profile && user.profile.name)
      return user.profile.name;
  }
  return  user.emails[0].address;
};

displayNameByID = function (userID) {
  var user = Meteor.users.findOne(userID);
  if(user == undefined)
    return;
  if (user.profile != undefined){
    if(user.profile && user.profile.name)
      return user.profile.name;
  }
  return  user.emails[0].address;
};

profilePic = function(user,size){
  var owner = Meteor.users.findOne(user);

  if(owner.profileImgUrl != undefined)
  {
    return owner.profileImgUrl;
  }
  else
  {
    if (owner.services && owner.services.facebook) {  
      return "http://graph.facebook.com/" + owner.services.facebook.id + "/picture/?type=large"; 
    }
    else if (owner.services && owner.services.google) {  
      return owner.services.google.picture; 
    }
/*    else if (owner.services && owner.services.twitter){
      return "https://api.twi tter.com/1/users/profile_image/" + owner.services.twitter.screenName;
    }*/
    else{ 
      return "/belush.jpg";
    }
  }
};

contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};


attending = function (knackevent) {
  return (_.groupBy(knackevent.rsvps, 'rsvp').yes || []).length;
};

/*String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};*/


