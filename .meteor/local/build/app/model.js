var knacktivity = new Meteor.Collection("knacktivity");
var taxonomy = new Meteor.Collection("taxonomy");
var FileSystem = new CollectionFS("FileSystem");



FileSystem.fileHandlers({
  default1: function(options) { //Options contains blob and fileRecord - same is expected in return if should be saved on filesytem, can be modified
    console.log(options.fileRecord); 
    console.log('I am handling 1: '+options.fileRecord.filename);
    return { blob: options.blob, fileRecord: options.fileRecord }; //if no blob then save result in fileURL (added createdAt)
  },
  default2: function(options) {
    if (options.fileRecord.len > 5000000 || options.fileRecord.contentType != 'image/jpeg') //Save som space, only make cache if less than 1Mb
      return null; //Not an error as if returning false, false would be tried again later...
    console.log('I am handling 2: '+options.fileRecord.filename);
    return options; 
  },
  size100x100: function(options) {
    //return null;
    var gm = __meteor_bootstrap__.require('gm');
    var newImage;
    gm(options.blob).resize(205,205).write("uploads/cfs/FileSystem/" + options.fileRecord._id + options.fileRecord.filename , function (err) {
      if (err) return handle(err);
      console.log('Created an image from a Buffer!');
    });;   
/*
        im(options.blob).resize(100,100).write('uploads/cfs/FileSystem/'+options.fileRecord.filename , function (err) {
      if (err) return handle(err);
      console.log('Created an image from a Buffer!');
    });;  */ 
    //console.log('I am handling: ' + options.fileRecord.filename + ' to...100x100');

    return { blob: newImage, fileRecord: options.fileRecord };//{ extension: 'png', blob: options.blob, fileRecord: options.fileRecord }; //or just 'options'...
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
      time: options.time,
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
  saveProfile: function(options){
    Meteor.users.update(
      {_id: this.userId},
      {$set: {"tagWanted": options.tagWanted, "tagShared": options.tagShared}});
  },
  updateTags: function(options){
    console.log(options);
    var user = Meteor.users.findOne(this.userId);

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
    }
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
   // Meteor.users.update(options);
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
  FileSystem.find().remove();
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


var displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return  "<a href ='#' class='userInfo' id='"+ user._id +"'>" + user.emails[0].address + "</a>";
};

var profilePic = function(user){
  var owner = Meteor.users.findOne(user);
  var pic = FileSystem.findOne({owner: owner._id});
  if(pic!=undefined){
    //var URLs = pic.fileURL;
    return 'uploads/cfs/FileSystem/' + pic._id + pic.filename;  
  }
  else
  {
    return "profile.png";
  }
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};


var attending = function (knackevent) {
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


