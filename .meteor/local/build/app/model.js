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
      rsvps: [],
      knacks: options.knacks
    });
  },
  invite: function (affairId, userId) {
    var affair = knacktivity.findOne(affairId);
    if (! affair || affair.owner !== this.userId)
      throw new Meteor.Error(404, "No such affair");
    if (affair.public)
      throw new Meteor.Error(400,
       "That affair is public. No need to invite people.");
    if (userId !== affair.owner && ! _.contains(affair.invited, userId)) {
      knacktivity.update(affairId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "affair: " + affair.title,
          text:
          "Hey, I just invited you to '" + affair.title + "' on All Tomorrow's knacktivity." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },
  rsvp: function (affairId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var affair = knacktivity.findOne(affairId);
    if (! affair)
      throw new Meteor.Error(404, "No such affair");
    if (! affair.public && affair.owner !== this.userId &&
      !_.contains(affair.invited, this.userId))
      // private, but let's not tell this to the user
    throw new Meteor.Error(403, "No such affair");

    var rsvpIndex = _.indexOf(_.pluck(affair.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        knacktivity.update(
          {_id: affairId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        knacktivity.update(affairId, modifier);
      }

      // Possible improvement: send email to the other people that are
      // coming to the affair.
    } else {
      // add new rsvp entry
      knacktivity.update(affairId,
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


var attending = function (affair) {
  return (_.groupBy(affair.rsvps, 'rsvp').yes || []).length;
};

