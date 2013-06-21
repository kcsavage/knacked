(function(){ 
Meteor.subscribe("directory");
Meteor.subscribe("knacktivity");
Meteor.subscribe("taxonomy");
//Meteor.subscribe("FileSystemknac");

//********************************************
//session variables
Session.set('editing_addtag_want', null); 
Session.set('editing_addtag_share', null);
Session.set('editing_addtag_knack', null);
Session.set('selected', null); //selected knacktivity
Session.set('user', null); //selected user
Session.set('createKnacktivity_tag', new Array()); //array that holds knactivity tags before they save a new one
Session.set('search_val', null);

//********************************************
//page helper functions

//sets focus on given textbox/screen element
var activateInput = function (input) { 
  input.focus();
  input.select();
};

//used for editing/adding knacks
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector] =
  function (evt) {
    if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        //console.log(value);
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
    return events;
  };


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
    },
    'click .userInfo': function(event, template)
    {
      Session.set("selected", event.currentTarget.id);
      Session.set("user", event.currentTarget.id);
    },
    'click .clearLink': function()
    {
      Session.set("search_val", null);
    }
  });

Template.page.events(okCancelEvents(
  '.search',
  {
    ok: function (value) {
      Session.set('search_val', value);
      Deps.flush();
    },
    cancel: function () {
      Session.set('search_val', null);
    }
  }));

//show knacktivities
Template.page.myEvent = function(){
  var searchParams = Session.get("search_val");
  if(searchParams == null){
    return knacktivity.find();
  }else
  {
    return knacktivity.find( {$or:[{ "knacks" : { "$regex" : searchParams, "$options" : "i" } },
      { "description" : { "$regex" : searchParams, "$options" : "i" } },
      { "title" : { "$regex" : searchParams, "$options" : "i" } }]});
  }
};

Template.page.showCreateDialog = function(){
  return Session.get("showCreateDialog");
};


Template.page.searchQuery = function(){
  var search = Session.get("search_val");
  if(search){
    return "Search Results For: " + Session.get("search_val") + " <a href='#' class='clearLink'>(clear)</a>";
  }
};



//*********************************************
// user_profile template

Template.page.showUserProfile = function(){

  return Session.get("showUserProfile");
};

var openUserProfile = function(){
  console.log("here");
 //if(Meteor.user()){
  var thisUser = Meteor.users.findOne(Meteor.userId);
  var users   = Meteor.users.find({"emails.address" : { "$regex" : "kcsavage@gmail.com", "$options" : "i" }}).fetch();
  var fbUsers = Meteor.users.find({"services.facebook.email" : { "$regex" : "kcsavage@gmail.com", "$options" : "i" }}).fetch();
  var gpUsers = Meteor.users.find({"services.google.email" : { "$regex" : "kcsavage@gmail.com", "$options" : "i" }}).fetch();
    //users = users.concat(fbUsers);
    //users = users.concat(gpUsers);

    //we've found some matches
    //if(users.length>1){
      console.log(fbUsers.length);
      //return "your shit's all fucked up";
      //if(currentUser.services != undefined){
        if(fbUsers.length>0){
          console.log('unifyFacebook');
          Meteor.call('unifyFBAccount', {
            facebook: fbUsers[0].services.facebook,
            user: Meteor.userId
          });
        }
        if(gpUsers.length>0){

        }
      //}
    //}

  //}
  Session.set("showUserProfile", true);
};

Template.user_profile.events({
  'click .cancel': function () {
    Session.set("showUserProfile", false);
  },
  'click .save': function(event,template){ //not currently used
    var tagWanted = template.find(".wanted").value;
    var tagShared = template.find(".shared").value;

    var tagShares = tagWanted.splitCSV();
    var tagWants = tagShared.splitCSV();
    Meteor.call('saveProfile', {
      _id:this._id,
      tagShared:tagShares,
      tagWanted:tagWants
    });
  },
  'click .addtag-want':function(event,template) {
    Session.set('editing_addtag_want', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-want"));
  },

  'click .addtag-share':function(event,template) {
    Session.set('editing_addtag_share', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-share"));
  }
});

//add and update knacktivity tags in profile
Template.user_profile.events(okCancelEvents(
  '#edittag-input-want',
  {
    ok: function (value) {
      var val = new Array();
      val.push(value);
      Meteor.call('updateTags', {
        _id:this._id,
        tagType: 'want',
        tag:val
      });
      Session.set('editing_addtag_want', null);
    },
    cancel: function () {
      Session.set('editing_addtag_want', null);
    }
  }));

Template.user_profile.events(okCancelEvents(
  '#edittag-input-share',
  {
    ok: function (value) {
      var val = new Array();
      val.push(value);
      Meteor.call('updateTags', {
        _id:this._id,
        tagType: 'share',
        tag:val
      });
      Session.set('editing_addtag_share', null);
    },
    cancel: function () {
      Session.set('editing_addtag_share', null);
    }
  }));

Template.user_profile.adding_tag_want = function () {
  return Session.equals('editing_addtag_want', this._id);
};

Template.user_profile.adding_tag_share = function () {
  return Session.equals('editing_addtag_share', this._id);
};

Template.user_profile.email = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 if (owner._id === Meteor.userId())
  return "me";
return displayName(owner);
};


Template.user_profile.tagWants = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 var owner_id = owner._id;
 return _.map(owner.tagWanted || [], function (tag) {
  return {owner_id: owner_id, tag: tag, tag_type:'want'};
});
};


Template.user_profile.tagShares = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 var owner_id = owner._id;
 return _.map(owner.tagShared || [], function (tag) {
  return {owner_id: owner_id, tag: tag, tag_type:'share'};
});
};

Template.user_profile.isSelf= function(){
  return this.owner === Meteor.userId();
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

Template.myEvents.profileImg = function(){
  return profilePic(this.owner);
};

//make the description short if long
Template.myEvents.description = function(){
  this.description;
  if (this.description.length>197){
    return this.description.substring(0,200) + '...';
  }
  else
  {
    return this.description;  
  }
  
};

Template.myEvents.knacktivityTags = function(){
  var owner = this;
  var owner_id = owner._id;
  return _.map(owner.knacks || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'knack'};
  });
};

Template.myEvents.usersName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.myEvents.myID = function () {
  return this._id;
}

//********************************************
//details template
Template.details.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.details.user = function(){
  return Session.get("user");
};

Template.details.knacktivity = function () {
  return knacktivity.findOne(Session.get("selected"));
};

Template.details.profileImg = function(){
  return profilePic(this.owner);
};

Template.details.knacktivityTags = function(){
  var owner = knacktivity.findOne(Session.get("selected"));
  var owner_id = owner._id;
  return _.map(owner.knacks || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'knack'};
  });
}

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

Template.details.numGoing = function()
{
  var yesRsvp = _.filter(this.rsvps, function (r) {
    return r.rsvp == 'yes';
  }) || {};
  return yesRsvp.length;
};

Template.details.numInvited = function(){
  //console.log(this);
  if(this.invited != undefined && this.rsvps !=undefined)
    var retval = this.invited.length - this.rsvps.length;
    if (retval>0)
    return this.invited.length - this.rsvps.length;
    else
    return "no one ";
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
  'click .removeListing': function () {
    knacktivity.remove(this._id); 
    return false;
  }
});

Template.details.events(okCancelEvents(
  '#add-comment',
  {
    ok: function (value,event) {
      Meteor.call('addComment', Session.get("selected"), value);
      event.target.value = "";
      Deps.flush();
    },
    cancel: function (target) {
    }
  }));

Template.details.rendered = function(){
   var users = _.map(Meteor.users.find(
          {}).fetch(),
        function(user){
          var name = displayNameByID(user._id);
          return {id:user._id, text:name};
        });
  $("#invitePeople").select2({
    placeholder:"Invite People",
    closeOnSelect:false,
    multiple:true,
    /*query:function(options){
      if(options.query){
        var users = _.map(Meteor.users.find(
          {"profile.name":options.term}).fetch(),
        function(user){
          var name = displayNameByID(user._id);
          return {id:user._id, text:name};
        })
      }
      else{
        var users = _.map(Meteor.users.find(
          {}).fetch(),
        function(user){
          var name = displayNameByID(user._id);
          return {id:user._id, text:name};
        })
      }

      var myresult={
       more: false,
       results: users
     };
     options.callback(myresult);
   }*/
   data:users
 });
}

//*************************************
//comment display
Template.details.events({
  'click .removeComment': function () {
    Meteor.call('removeComment', Session.get("selected"), event.currentTarget.id);
  }
});

Template.details.userName = function(){
  var owner = Meteor.users.findOne(this.user);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
}

Template.details.timestamp = function(){
  var ts = new Date(this.timestamp);
  return ts.toLocaleString();
};

Template.details.commentCount = function(){
  if(this.comments.length>0)
    return this.comments.length + " Comments";
  else
    return "Comment on this!"
}

Template.details.commentProfileImg = function(){
  var owner = Meteor.users.findOne(this.user);
  return profilePic(owner._id);
};

//********************************************
//CreateDialog template

Template.createDialog.events({
  'click .save': function (event, template){
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var date = template.find(".datePicker").value;
    var timeStart = template.find(".timeStart").value;
    var timeEnd = template.find(".timeEnd").value;
    var location = template.find(".location").value;
    var public = ! template.find(".private").checked;
    var commenting = template.find(".commenting").checked;
    var knacks = Session.get('createKnacktivity_tag');

    //console.log(title);
    //console.log(description);

    if (title.length && description.length) {
      Meteor.call('createKnacktivity', {
        title: title,
        description: description,
        date: date,
        timeStart: timeStart,
        timeEnd: timeEnd,
        location: location,
        public: public,
        knacks: knacks,
        commenting: commenting
      }, function (error, Knacktivity) {
        if (! error) {
          Session.set("selected", Knacktivity);
          //if (! public && Meteor.users.find().count() > 1)
          //  openInviteDialog();
        }
      });
      Session.set("showCreateDialog", false);
      Session.set('createKnacktivity_tag',new Array());//clear this out for our next event we add
    } else {
      Session.set("createError",
        "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("createKnacktivity_tag", new Array());
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
  $(".datePicker").datepicker({ minDate: new Date().now });
  $(".timeStart").timepicker();
  $(".timeEnd").timepicker();
};

//************************************
//add_tag_knack template
//had to add this template to prevent create knacktivity
//dialog from breaking

Template.add_tag_knack.events({
  'click .addtag-knack':function(event,template) {
    Session.set('editing_addtag_knack', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-knack"));
  }
});

Template.add_tag_knack.events(okCancelEvents(
  '#edittag-input-knack',
  {
    ok: function (value) {
      var val = Session.get("createKnacktivity_tag");
      val.push(value);
      Session.set("createKnacktivity_tag",val);
      Session.set('editing_addtag_knack', null);
    },
    cancel: function () {
      Session.set('editing_addtag_knack', null);
    }
  }));

Template.add_tag_knack.tagKnacks = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 var owner_id = owner._id;
 return _.map( Session.get('createKnacktivity_tag') || [], function (tag) {
  return {owner_id: owner_id, tag: tag, tag_type:'knack_add'};
});
};

Template.add_tag_knack.adding_tag_knack = function () {
  return Session.equals('editing_addtag_knack', this._id);
};


//************************************
//Attendence Template
Template.attendance.rsvpName = function () {
  return displayNameRaw(this);
};

Template.attendance.rsvpProfileImg = function(){
  return profilePic(this);
};

Template.attendance.outstandingInvitations = function () {
  var affair = knacktivity.findOne(this._id);
  return Meteor.users.find({$and: [
    {_id: {$in: affair.invited}}, // they're invited
    {_id: {$nin: _.pluck(affair.rsvps, 'user')}} // but haven't RSVP'd
    ]});
};

Template.attendance.invitationName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayNameRaw(user);
};

Template.attendance.invitationProfileImg = function(){
  var owner = Meteor.users.findOne(this.user);
  return profilePic(owner._id);
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

Template.attendance.rendered = function(){
  //var user = Meteor.users.findOne(this.user);
  //var dName = displayName(user);
  $(".rsvpProfilePic").tooltip();
}
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
    console.log(this._id);
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


Template.knack_item.knacks= function(){
  try{
    return this.tag;
  }catch(err){
    log_event(err, LogLevel.Error);
  }
}

Template.knack_item.events({
  'click .remove': function (evt) {
    ////console.log(this.owner_id);
    var tag = this.tag;
    var id = this.owner_id;
    var tag_type = this.tag_type;
    evt.target.parentNode.style.opacity = 0;
    switch(tag_type)
    {
      case 'want':
      Meteor.setTimeout(function () {
        Meteor.call('removeProfileTags', {
          _id:id,
          tagType: 'want',
          tag:tag
        });
      }, 300);
      break;
      case 'share':
      Meteor.setTimeout(function () {
        Meteor.call('removeProfileTags', {
          _id:id,
          tagType: 'share',
          tag:tag
        }); 
      }, 300);
      break;
      case 'knack':
      Meteor.setTimeout(function () {
        knacktivity.update({_id: id}, {$pull: {knacks: tag}}); 
      }, 300);
      break;  
      case 'knack_add': //this is used from create dialog because we're in memory
      Meteor.setTimeout(function () {
        var val = Session.get("createKnacktivity_tag");
        var index = val.indexOf(tag);
        val.splice(index,1);
        Session.set("createKnacktivity_tag", val);
      }, 300);
      break; 
    }
  }
});

//********************************
// user_profile_view Template

Template.user_profile_view.events({
  'click .followMe': function (evt) {//Follow another user
    var val = new Array();
    val.push(Session.get("user"));
    Meteor.call('followSomeone', {
      followId: val
    });
  }
  ,
    'click .unFollowMe': function (evt) {//Follow another user
      var val = new Array();
      val.push(Session.get("user"));
      Meteor.call('unFollowSomeone', {
        followId: val
      });
    }

  });


Template.user_profile_view.myname = function(){
  var owner = Meteor.users.findOne(Session.get("user"));
  return displayName(owner);
};

Template.user_profile_view.shares = function(){
  var owner = Meteor.users.findOne(Session.get("user"));
  var owner_id = owner._id;
  return _.map(owner.tagShared || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'share'};
  });
};

Template.user_profile_view.wants = function(){
  var owner = Meteor.users.findOne(Session.get("user"));
  var owner_id = owner._id;
  return _.map(owner.tagWanted || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'want'};
  });
};

Template.user_profile_view.followers = function(){
  return Meteor.users.find({following:Session.get("user")});
};

Template.user_profile_view.following = function(){
  owner = Meteor.users.findOne(Session.get("user"));
  if(owner.following != undefined){
   return _.map(owner.following || [], function (uid) {
    return {uid: uid}; });
 }
 else
 {
   return new Array();
 }
};

//Flip flop between follow and unfollow user
Template.user_profile_view.currentlyFollowing = function(){
  var otherUser = Session.get("user");
  if(jQuery.inArray(otherUser,Meteor.users.findOne(Meteor.userId()).following)>=0)
    return true;
  else
    return false;
};

//*************************************
// user_list & user_array Templates

Template.user_list.user = function(){
  return displayName(this);
};

Template.user_array.user = function(){
  var user = Meteor.users.findOne(this.uid);
  return displayName(user);
};

//******************************************
// file upload template

/*
Template.queControl.events({
  'change .fileUploader': function (e) {
   var fileList = e.target.files;
   for (var i = 0, f; f = fileList[i]; i++) {
     var res= FileSystem.storeFile(f);
     //console.log(res);
   }
   if (fileItem.blob)
    saveAs(fileItem.blob, fileItem.filename)
  else
    saveAs(fileItem.file, fileItem.filename);
}
});

Template.fileTable.events({
  'click .btnFileSaveAs': function() {
    FileSystem.retrieveBlob(this._id, function(fileItem) {
      if (fileItem.blob)
        saveAs(fileItem.blob, fileItem.filename)
      else
        saveAs(fileItem.file, fileItem.filename);
    });
      } //EO saveAs
    });

Template.fileTable.helpers({
  Files: function() {
    return FileSystem.find({}, { sort: { uploadDate:-1 } });
  }
});
*/

Template.fileTable.file = function(){
  var URLs = this.fileURL;
  //console.log(this);
  if(URLs.length>0){
    return URLs[0].path;
  }  
};  

////////// Tracking selections in URL //////////

var myRouter = Backbone.Router.extend({
  routes: {
    "knacktivity/:query":   "knacktivity",    // #kancktivity/knacktivity_id
    "search/:query":        "search",         // #search/beer
    "users/:query":         "users"           // #users/user_id
  },
  knacktivity: function (knacktivity_id) {
    Session.set("selected", knacktivity_id);
    Session.set("search_val", null);
    Session.set("user", null);
  },
  search: function (search) {
    Session.set("search_val", search);
    Session.set("selected", null);
    Session.set("user", null);
  },
  users: function (user_id) {
    Session.set("user", user_id);
    Session.set("selected", null);
    Session.set("search_val", null);

  },
  setKnacktivity: function (knacktivity_id) {
    this.navigate(knacktivity_id, true);
  }
});

Router = new myRouter;

if (!Meteor.isServer) {
  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
  });
}


}).call(this);
