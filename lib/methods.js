Meteor.methods({
  createKnacktivity: function(options){
    options = options || {};
    var tax = arrayToTaxonomy(options.knacks);
    taxonomy.insert(tax);
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
    console.log(options);
    Meteor.users.update(
      {_id: this.userId},
      {$set: {
        "username" : options.username,
        "firstName" : options.firstName,
        "lastName" : options.lastName,
        "email" : options.email,
        "company" : options.company,
        "description" : options.description
      }});
  },
  saveProfileSingleField: function(options){
    Meteor.users.update(
      {_id: this.userId},
      {$set: 
        options
      });
  },
  saveProfileImg: function(url){
    console.log(url);
    Meteor.users.update(
      {_id: this.userId},
      {$set: {"profileImgUrl": url}});
  },

  updateTags: function(options){
    var user = Meteor.users.findOne(this.userId);
    //knactivities user wants
    var tax = arrayToTaxonomy(options.tag);
    taxonomy.insert(tax);
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
unifyFBAccount: function(options){
  var user = Meteor.users.findOne(options.user);
  if(user.services.facebook == undefined){
    console.log('test2');
    Meteor.users.update(
      {_id: options.user},
      {$set: {'services.$.facebook': options.facebook}});
  }
},
setUsername: function(options){
 Meteor.users.update(
  {_id: options.user},
  {$set: {'username': options.username}});

}
});