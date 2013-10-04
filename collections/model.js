knacktivity = new Meteor.Collection("knacktivity");
taxonomy = new Meteor.Collection("taxonomy");

displayName = function (user) {
  if(user ==undefined)
    return;
  var name = displayNameRaw(user);
  /*if (user != undefined && user.profile && user.profile.name)
    return user.profile.name;
  if(user.username == undefined){
    if(Meteor.user._id == user._id){
      if(name.indexOf("@")!=-1)
        name = name.substring(name,0,name.indexOf("@"));

      Meteor.call('setUsername',
      {
        user:user._id,
        username: name
      });
      return  "<a href ='/user/" + user.username +"' class='userInfo' id='"+ user.username +"'>" + user.username + "</a>"; 
    }
    else
    {
      return  "<a href ='/users/" + user._id  +"' class='userInfo' id='"+ user._id +"'>" + name + "</a>";
    }
  }
  else
  {*/
   return  "<a href ='/users/" + user._id  +"' class='userInfo' id='"+ user._id +"'>" + name + "</a>";
 //}
 
 
};

displayNameRaw = function (user) {
  if(user == undefined)
    return;
  if (user.profile != undefined){
    if(user.profile && user.profile.name)
      return user.profile.name;
  }
  return user.emails[0].address;
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


