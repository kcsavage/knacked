  Template.page.greeting = function () {
    return "Welcome to knacked_m.";
  };

  Template.page.events({
    'click .add' : function () {
      // template data, if any, is available in 'this'
      openCreateDialog();
    }
  });

  Template.page.myEvent = function(){
    return knacktivity.find();
  };

var openCreateDialog = function(x, y){
  //Session.set("createCoords", {x: x, y: y});
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function(){
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template){
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    
    if (title.length && description.length) {
      Meteor.call('createKnacktivity', {
        title: title,
        description: description,
        public: public
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

Template.createDialog.error = function () {
  return Session.get("createError");
};