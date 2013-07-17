(function(){ knacktivity = new Meteor.Collection("knacktivity");
taxonomy = new Meteor.Collection("taxonomy");
FileSystem = new CollectionFS("FileSystem");


FileSystem.fileHandlers({
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
});


Meteor.methods({
  createKnacktivity: function(options){
    options = options || {};
    
    return knacktivity.insert({
      owner: this.userId,
      title: options.title,
      description: options.description,
      date: options.date,
      timeStart: options.timeStart,
      timeEnd: options.timeEnd,
      location: options.location,
      public: !! options.public,
      commenting: !! options.commenting,
      invited: [],
      rsvps: [],
      comments: [],
      knacks: options.knacks
    });
  },
  invite: function (knackeventId, userId) {
    var knackevent = knacktivity.findOne(knackeventId);
    if (! knackevent || knackevent.owner !== this.userId)
      throw new Meteor.Error(404, "No such knacktivity");
    if (knackevent.public)
      throw new Meteor.Error(400,
       "That knacktivity is public. No need to invite people.");
    if (userId !== knackevent.owner && ! _.contains(knackevent.invited, userId)) {
      knacktivity.update(knackeventId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "tugboat@knacked.net",
          to: to,
          replyTo: from || undefined,
          subject: "event: " + knackevent.title,
          text:
          "Hey, I just invited you to '" + knackevent.title + "' on Knacked." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },
  rsvp: function (knackeventId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var knackevent = knacktivity.findOne(knackeventId);
    if (! knackevent)
      throw new Meteor.Error(404, "No such event");
    if (! knackevent.public && knackevent.owner !== this.userId &&
      !_.contains(knackevent.invited, this.userId))
      // private, but let's not tell this to the user
    throw new Meteor.Error(403, "No such event");

    var rsvpIndex = _.indexOf(_.pluck(knackevent.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        knacktivity.update(
          {_id: knackeventId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        knacktivity.update(knackeventId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the knackevent.
    } else {
      // add new rsvp entry
      knacktivity.update(knackeventId,
       {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  },
  addComment: function (knackeventId, comment) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to comment");
    var knackevent = knacktivity.findOne(knackeventId);
    if (! knackevent)
      throw new Meteor.Error(404, "No such event");
    if (! knackevent.public && knackevent.owner !== this.userId && !_.contains(knackevent.invited, this.userId)) //non-public event
      throw new Meteor.Error(403, "No such event");
    if (! knackevent.commenting) //non-public event
      throw new Meteor.Error(403, "Commenting not allowed");
    knacktivity.update(knackeventId, {$push: {comments: {user: this.userId, comment: comment, timestamp:Date(), flagged:false, deleted:false}}});
  },
  removeComment: function (knackeventId, commentId) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to remove a comment");
    var knackevent = knacktivity.findOne(knackeventId);
    if (! knackevent)
      throw new Meteor.Error(404, "No such event");
    if (! knackevent.public && knackevent.owner !== this.userId && !_.contains(knackevent.invited, this.userId)) //non-public event
      throw new Meteor.Error(403, "No such event");
    var commentIndex = _.indexOf(_.pluck(knackevent.comments, 'user'), this.userId);
    if (commentIndex !== -1) {
      /*if (Meteor.isServer) {
        // update the appropriate comment entry with $
        console.log("here");*/
        knacktivity.update(
          {_id: knackeventId, "comments.user": this.userId},
          {$set: {"comments.$.deleted": true}});
      /*} else {
        console.log("here2");
        var modifier = {$set: {}};
        modifier.$set["comments." + commentIndex + ".deleted"] = true;
        knacktivity.update(knackeventId, modifier);
      }*/
    }
  },
  flagComment: function (knackeventId, commentId) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to flag a comment");
    var knackevent = knacktivity.findOne(knackeventId);
    if (! knackevent)
      throw new Meteor.Error(404, "No such event");
    if (! knackevent.public && knackevent.owner !== this.userId && !_.contains(knackevent.invited, this.userId)) //non-public event
      throw new Meteor.Error(403, "No such event");
  },
  saveProfile: function(options){
    Meteor.users.update(
      {_id: this.userId},
      {$set: {"tagWanted": options.tagWanted, "tagShared": options.tagShared}});
  },
  updateTags: function(options){
    var user = Meteor.users.findOne(this.userId);
    //knactivities user wants
    if(options.tagType=='want'){
      if(user.tagWanted != null){
        Meteor.users.update(
          {_id: this.userId},
          {$addToSet: {"tagWanted": options.tag}});
      }
      else
      {
        Meteor.users.update(
          {_id: this.userId},
          {$set: {"tagWanted": options.tag}});
      }
    }//knacktivities user has and would like to share
    else if(options.tagType=='share')
    {
      if(user.tagShared != null){
        Meteor.users.update(
          {_id: this.userId},
          {$addToSet: {"tagShared": options.tag}});
      }
      else
      {
        Meteor.users.update(
          {_id: this.userId},
          {$set: {"tagShared": options.tag}});
      }
    }
    else //knacktivity tag
    {
/*      if(user.tagShared != null){
        Meteor.users.update(
          {_id: this.userId},
          {$push: {"tagShared": options.tag}});
      }
      else
      {
        Meteor.users.update(
          {_id: this.userId},
          {$set: {"tagShared": options.tag}});
}*/
}
},
removeProfileTags: function(options){
   //get rid of knacks the user no longer has or wants
   if(options.tagType=="want"){
    Meteor.users.update(
      {_id: this.userId},
      {$pull: {tagWanted: options.tag}});
  }else
  {
    Meteor.users.update(
      {_id: this.userId},
      {$pull: {tagShared: options.tag}});
  }
},
followSomeone: function(options){
  var user = Meteor.users.findOne(this.userId);
  if(user.following != null){
    Meteor.users.update(
      {_id: this.userId},
      {$addToSet: {"following": options.followId[0]}});
  }
  else
  {
    Meteor.users.update(
      {_id: this.userId},
      {$set: {"following": options.followId}});
  }
},
unFollowSomeone: function(options){
  var user = Meteor.users.findOne(this.userId);
  if(user.following != null){
    Meteor.users.update(
      {_id: this.userId},
      {$pull: {"following": options.followId[0]}});
  }
},
removeFile: function(options){
  //FileSystem.find().remove();
},
unifyFBAccount: function(options){
  var user = Meteor.users.findOne(options.user);
  if(user.services.facebook == undefined){
    console.log('test2');
    Meteor.users.update(
      {_id: options.user},
      {$set: {'services.$.facebook': options.facebook}});
  }
}
});


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
  if (user.profile && user.profile.name)
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
  var pic = FileSystem.findOne({owner: owner._id});

  if(size == undefined)
    size='small';
  if(pic!=undefined){
    return 'cfs/FileSystem/' + pic._id + '_' + size + '.jpg';
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
      return "belush.jpg";
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



}).call(this);
