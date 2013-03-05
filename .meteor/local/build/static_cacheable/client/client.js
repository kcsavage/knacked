
Meteor.subscribe("directory");
Meteor.subscribe("knacktivity");

//*********************************************
//page template

Template.page.events({
  'click .add' : function () {
      // template data, if any, is available in 'this'
      openCreateDialog();
    },
    'click .showUser' : function () {
      // template data, if any, is available in 'this'
      openUserProfile();
    }

  });

Template.page.greeting = function () {
  return "Welcome to Knacked";
};

Template.page.myEvent = function(){
  return knacktivity.find();//, {sort:{date: 1, time: 1}});
};

Template.page.showCreateDialog = function(){
  return Session.get("showCreateDialog");
};
/*
  var sortByUser = function(){
    Template.page.myEvent = function(){
      return knacktivity.find({},{usersName:-1});
    };
  };

  var sortByTitle = function(){
    Template.page.myEvent = function(){
      return knacktivity.find({}, {sort:{time: -1}});
      
    };
  };

  var sortByDescription = function(){
    Template.page.myEvent = function(){
      return knacktivity.find({},{description:-1});
    };
  };
  */
//*********************************************
// user_profile template

Template.page.showUserProfile = function(){
  return Session.get("showUserProfile");
};

var openUserProfile = function(){
//  Session.set("createError", null);
Session.set("showUserProfile", true);
};

Template.user_profile.events({
  'click .cancel': function () {
    Session.set("showUserProfile", false);
  }
});

Template.user_profile.email = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 if (owner._id === Meteor.userId())
  return "me";
return displayName(owner);
};

Template.user_profile.shared = function(){
  return "this is what i'm sharing";
};

Template.user_profile.wanted = function(){
  return "this is what i'm wanting";
};
//**********************************************
//myEvents template

Template.myEvents.events({
  'mousedown .getDescription': function(event, template)
  {
    Session.set("selected", event.currentTarget.id);
  }
});

Template.myEvents.myTitle = function(){
  return this.title;
};

Template.myEvents.rendered = function(){
  var self = this;
  self.node = self.find("a");
  var count = 0;
  if (! self.handle){
    self.handle = Meteor.autorun(function(){
      var selected = Session.get('selected');
      var selectedParty = selected && knacktivity.findOne(selected);

      var updateTitles = function(group){
        group.attr("id", function (party) { return party._id; });
      };

      var me = d3.selectAll(".getDescription")
      .data(knacktivity.find().fetch());

      //this seems kluge
      updateTitles(me.enter().append("text"));
      updateTitles(me.transition().duration(250).ease("cubic-out"));
      me.exit().remove();

    });
  };
};

//********************************************
//details template
Template.details.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.details.knacktivity = function () {
  return knacktivity.findOne(Session.get("selected"));
};


Template.details.anyKnacktivity = function () {
  return knacktivity.find().count() > 0;
};

Template.details.canRemove = function () {
  return this.owner === Meteor.userId() && attending(this) === 0;
};

Template.details.maybeChosen = function (what) {
  var myRsvp = _.find(this.rsvps, function (r) {
    return r.user === Meteor.userId();
  }) || {};

  return what == myRsvp.rsvp ? "chosen btn-inverse" : "";
};

Template.details.events({
  'click .rsvp_yes': function () {
    Meteor.call("rsvp", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("rsvp", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("rsvp", Session.get("selected"), "no");
    return false;
  },
  'click .invite': function () {
    openInviteDialog();
    return false;
  },
  'click .remove': function () {
    knacktivity.remove(this._id);
    return false;
  }
});

//********************************************
//CreateDialog template

Template.createDialog.events({
  'click .save': function (event, template){
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var date = template.find(".datePicker").value;
    var time = template.find(".time").value;
    var location = template.find(".location").value;
    var knack = template.find(".knacks").value;
    var public = ! template.find(".private").checked;
    
    var knacks = knack.splitCSV();

    if (title.length && description.length) {
      Meteor.call('createKnacktivity', {
        title: title,
        description: description,
        date: date,
        time: time,
        location: location,
        public: public,
        knacks: knacks
      }, function (error, Knacktivity) {
        if (! error) {
          Session.set("selected", Knacktivity);
          //if (! public && Meteor.users.find().count() > 1)
          //  openInviteDialog();
        }
      });
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
        "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

var openCreateDialog = function(x, y){
  //Session.set("createCoords", {x: x, y: y});
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.createDialog.error = function () {
  return Session.get("createError");
};

Template.createDialog.rendered = function(){
  $(".datePicker").datepicker();
};

//************************************
//Attendence Template
Template.attendance.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.attendance.outstandingInvitations = function () {
  var affair = knacktivity.findOne(this._id);
  return Meteor.users.find({$and: [
    {_id: {$in: affair.invited}}, // they're invited
    {_id: {$nin: _.pluck(affair.rsvps, 'user')}} // but haven't RSVP'd
    ]});
};

Template.attendance.invitationName = function () {
  return displayName(this);
};

Template.attendance.rsvpIs = function (what) {
  return this.rsvp === what;
};

Template.attendance.nobody = function () {
  return ! this.public && (this.rsvps.length + this.invited.length === 0);
};

Template.attendance.canInvite = function () {
  return ! this.public && this.owner === Meteor.userId();
};

///////////////////////////////////////////////////////////////////////////////
// Invite dialog

var openInviteDialog = function () {
  Session.set("showInviteDialog", true);
};

Template.page.showInviteDialog = function () {
  return Session.get("showInviteDialog");
};

Template.inviteDialog.events({
  'click .invite': function (event, template) {
    Meteor.call('invite', Session.get("selected"), this._id);
  },
  'click .done': function (event, template) {
    Session.set("showInviteDialog", false);
    return false;
  }
});

Template.inviteDialog.uninvited = function () {
  var affair = knacktivity.findOne(Session.get("selected"));
  if (! affair)
    return []; // affair hasn't loaded yet
  return Meteor.users.find({$nor: [{_id: {$in: affair.invited}},
   {_id: affair.owner}]});
};

Template.inviteDialog.displayName = function () {
  return displayName(this);
};
//********************************
//  knack item template
//  figure this out
// goes in details template:
//    <ul id="knack-list">
//      {{#each knacks}}
//      {{> knack_item}}
//      {{/each}}
//    </ul>
//    

Template.knack_item.knacks= function(){
      try{
          return this;
      }catch(err){
          log_event(err, LogLevel.Error);
      }
}