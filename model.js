var knacktivity = new Meteor.Collection("knacktivity");

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
      invited: [],
      rsvps: []
    });
  },
  invite: function (knackId, userId) {
    var knack = knacktivity.findOne(knackId);
    if (! knack || knack.owner !== this.userId)
      throw new Meteor.Error(404, "No such knack");
    if (knack.public)
      throw new Meteor.Error(400,
       "That knack is public. No need to invite people.");
    if (userId !== knack.owner && ! _.contains(knack.invited, userId)) {
      knacktivity.update(knackId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "knack: " + knack.title,
          text:
          "Hey, I just invited you to '" + knack.title + "' on All Tomorrow's knacktivity." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },
  rsvp: function (knackId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var knack = knacktivity.findOne(knackId);
    if (! knack)
      throw new Meteor.Error(404, "No such knack");
    if (! knack.public && knack.owner !== this.userId &&
      !_.contains(knack.invited, this.userId))
      // private, but let's not tell this to the user
    throw new Meteor.Error(403, "No such knack");

    var rsvpIndex = _.indexOf(_.pluck(knack.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        knacktivity.update(
          {_id: knackId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        knacktivity.update(knackId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the knack.
    } else {
      // add new rsvp entry
      knacktivity.update(knackId,
       {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});

var displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};


var attending = function (knack) {
  return (_.groupBy(knack.rsvps, 'rsvp').yes || []).length;
};