

//********************************************
//page helper functions

getValFromWatermark = function(txtBox){
  if ($(txtBox).val() == $(txtBox).attr("wm")){
    return '';
  }
  else{
    return $(txtBox).val();
  }
}

fileUploaded = function(e){
  console.log(e);
  Meteor.call('saveProfileImg', e.fpfile.url);
}

//sets focus on given textbox/screen element
var activateInput = function (input) { 
  input.focus();
  input.select();
};

//Disable Scroll on Modal Popup
var toggleScroll = function () {
  document.body.classList.toggle("noScroll");
}

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
      if(Meteor.userId() == null){
        openModalSUSI();
      }else
      {
        openModalEvent();
      }
    },
    'click .showUser' : function () {
      // template data, if any, is available in 'this'
      if(Meteor.userId() == null){
        openModalSUSI();
      }else
      {
        openUserProfile();
      }
    },
    'click .showModalProfile' : function () {
      // template data, if any, is available in 'this'
      toggleScroll();
      if(Meteor.userId() == null){
        openModalSUSI();
      }else
      {
        openModalProfile();
      }
      return false;
    },
/*    'click .userInfo': function(event, template)
    {
      Session.set("selected", event.currentTarget.id);
      Session.set("user", event.currentTarget.id);
    },*/
    'click .clearLink': function()
    {
      Session.set("search_val", null);
    },
    'mousedown .userInfo': function(event, template)
    {
    //Session.set("selected", event.currentTarget.id);
    console.log('calling setuser');
    Router.setUser(event.currentTarget.id);
    console.log('called setuser');
  },
  'click .userInfo': function (evt) 
  {
        // prevent clicks on <a> from refreshing the page.
        console.log('prevent default');
        evt.preventDefault();

      },
      'mousedown .getDescription': function(event, template)
      {
      //Session.set("selected", event.currentTarget.id);
      Router.setKnacktivity(event.currentTarget.id);
    },
    'click .eventLink': function (evt) {
      // prevent clicks on <a> from refreshing the page.
      evt.preventDefault();
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

Template.page.showModalEvent = function(){
  return Session.get("showModalEvent");
};


Template.page.searchQuery = function(){
  var search = Session.get("search_val");
  if(search){
    return "Search Results For: " + Session.get("search_val") + " <a href='#' class='clearLink'>(clear)</a>";
  }
};



//*********************************************

// ModalProfile template

Template.page.showModalProfile = function(){
  return Session.get("showModalProfile");
};

Template.page.showModalSUSI = function(){
  return Session.get("showModalSUSI");
};

var openModalSUSI = function(){
  Session.set("showModalSUSI", true);
};

var openModalProfile = function(){
  Session.set("showModalProfile", true);
};

Template.modalProfile.events({
  'click .cancel': function () {
    toggleScroll();
    Session.set("showModalProfile", false);
    return false;
  },
  'click .save': function(event,template){
    var uName = getValFromWatermark(template.find(".username"));
    var firstName = getValFromWatermark(template.find(".firstName"));
    var lastName = getValFromWatermark(template.find(".lastName"));
    var email = getValFromWatermark(template.find(".email"));
    var company = getValFromWatermark(template.find(".company"));
    var description = getValFromWatermark(template.find(".description"));

    var owner = Meteor.users.findOne(Meteor.userId());
    //check if username is unique.
    var users = Meteor.users.find({username:uName}).count();
    if(uName == owner.username ||users == 0){

      Meteor.call('saveProfile', {
        _id:this._id,
        username : uName,
        firstName : firstName,
        lastName : lastName,
        email : email,
        company : company,
        description : description
      });
    }
  },
  'click .addtag-want':function(event,template) {
    Session.set('editing_addtag_want', this._id);
    //Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-want"));
  },

  'click .addtag-share':function(event,template) {
    Session.set('editing_addtag_share', this._id);
    //Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-share"));
  }
/*   if (fileItem.blob)
    saveAs(fileItem.blob, fileItem.filename)
  else
    saveAs(fileItem.file, fileItem.filename);*/
//}
});

//add and update knacktivity tags in profile
Template.modalProfile.events(okCancelEvents(
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

Template.modalProfile.events(okCancelEvents(
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

Template.modalProfile.adding_tag_want = function () {
  return Session.equals('editing_addtag_want', this._id);
};

Template.modalProfile.adding_tag_share = function () {
  return Session.equals('editing_addtag_share', this._id);
};

Template.modalProfile.email = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 if(owner.email !=undefined)
  return owner.email
return "";
};

Template.modalProfile.lastName = function(){
  var owner = Meteor.users.findOne(Meteor.userId());
  if(owner.lastName != undefined)
    return owner.lastName;
};

Template.modalProfile.firstName = function(){
  var owner = Meteor.users.findOne(Meteor.userId());
  if(owner.firstName != undefined)
    return owner.firstName;
};

Template.modalProfile.company = function(){
  var owner = Meteor.users.findOne(Meteor.userId());
  if(owner.company != undefined)
    return owner.company;
};

Template.modalProfile.username = function(){
  var owner = Meteor.users.findOne(Meteor.userId());
  console.log(owner.username)
  if(owner.username != undefined)
    return owner.username;
};

Template.modalProfile.description = function(){
  var owner = Meteor.users.findOne(Meteor.userId());

  if(owner.description != undefined)
    return owner.description;
};

Template.modalProfile.profileTempPic=function(){
    //var owner = Meteor.users.findOne(this.user);
    var owner = Meteor.users.findOne(Meteor.userId());
    var picStr = profilePic(owner,'medium');
    //console.log(owner);
    //console.log(picStr);
    return profilePic(owner,'medium');
  };

  Template.modalProfile.tagWants = function(){
   var owner = Meteor.users.findOne(Meteor.userId());
   var owner_id = owner._id;
   return _.map(owner.tagWanted || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'want'};
  });
 };


 Template.modalProfile.tagShares = function(){
   var owner = Meteor.users.findOne(Meteor.userId());
   var owner_id = owner._id;
   return _.map(owner.tagShared || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'share'};
  });
 };

 Template.modalProfile.isSelf= function(){
  return this.owner === Meteor.userId();
};

Template.modalProfile.following = function(){
  var owner = Meteor.users.findOne(Meteor.userId());
  if(owner.following != undefined){
   return _.map(owner.following || [], function (uid) {
    return {uid: uid}; });
 }
 else
 {
   return new Array();
 }
};

Template.modalProfile.rendered=function(){
  //setup filepicker
  filepicker.constructWidget(document.getElementById('uploadWidget'));
  /*$('.profilePic').Jcrop({aspectRatio: 9 / 9});
$('.profilePic').attr('style','');
jcrop_api.destroy();
*/

//only show wm if there's no value
$(".wm").val(function(){
  if ($(this).attr("value") =='')
    return $(this).attr("wm");
  else
    return $(this).attr("value");
}).addClass("watermark");


    //if blur and no value inside, set watermark text and class again.
    $('.wm').blur(function(){
      if ($(this).val().length == 0){
        $(this).val($(this).attr("wm")).addClass('watermark');
      }
    });

  //if focus and text is watermrk, set it to empty and remove the watermark class
  $('.wm').focus(function(){
    if ($(this).val() == $(this).attr("wm")){
      $(this).val('').removeClass('watermark');
    }
  });

  $('.selfSave').blur(function(){
    if($(this).val()!=$(this).attr("wm")){
     var obj = {key: 'value'};
     var obj2 = {};
     var key = $(this).attr('field');
     obj2[key] = $(this).val();
     console.log(obj2);
     Meteor.call('saveProfileSingleField',obj2);
     $(this).val(obj2[key]);
   }
 });
};
//**********************************************
//myEvents template

Template.listing.events({

});

Template.listing.myTitle = function(){
  return this.title;
};

Template.listing.profileImg = function(){
  return profilePic(this.owner);
};

//make the description short if long
Template.listing.description = function(){
  this.description;
  if (this.description.length>197){
    return this.description.substring(0,200) + '...';
  }
  else
  {
    return this.description;  
  }
  
};

Template.listing.knacktivityTags = function(){
  var owner = this;
  var owner_id = owner._id;
  return _.map(owner.knacks || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'knack'};
  });
};

Template.listing.usersName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

/*Template.listing.myID = function () {
  return this._id;
}*/

//********************************************
//details template
Template.detailKnacktivity.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.detailKnacktivity.user = function(){
  return Session.get("user");
};

Template.detailKnacktivity.knacktivity = function () {
  return knacktivity.findOne(Session.get("selected"));
};

Template.detailKnacktivity.profileImg = function(){
  return profilePic(this.owner);
};

Template.detailKnacktivity.knacktivityTags = function(){
  var owner = knacktivity.findOne(Session.get("selected"));
  var owner_id = owner._id;
  return _.map(owner.knacks || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'knack'};
  });
}

Template.detailKnacktivity.anyKnacktivity = function () {
  return knacktivity.find().count() > 0;
};

Template.detailKnacktivity.canRemove = function () {
  return this.owner === Meteor.userId() && attending(this) === 0;
};

Template.detailKnacktivity.maybeChosen = function (what) {
  var myRsvp = _.find(this.rsvps, function (r) {
    return r.user === Meteor.userId();
  }) || {};

  return what == myRsvp.rsvp ? "chosen btn-inverse" : "";
};

Template.detailKnacktivity.numGoing = function()
{
  var yesRsvp = _.filter(this.rsvps, function (r) {
    return r.rsvp == 'yes';
  }) || {};
  return yesRsvp.length;
};

Template.detailKnacktivity.numInvited = function(){
  //console.log(this);
  if(this.invited != undefined && this.rsvps !=undefined)
    var retval = this.invited.length - this.rsvps.length;
  if (retval>0)
    return this.invited.length - this.rsvps.length;
  else
    return "no one ";
};

Template.detailKnacktivity.events({
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
    openModalInvite();
    return false;
  },
  'click .removeListing': function () {
    knacktivity.remove(this._id); 
    return false;
  },
  'click .inviteButton': function (){
    var users=$("#invitePeople").select2("val");
    for (var i=0;i<users.length;i++)
    { 
      Meteor.call('invite', Session.get("selected"), users[i]);
    }
    $("#invitePeople").select2("val","");
  },
  'mousedown .userInfo': function(event, template)
  {
    //Session.set("selected", event.currentTarget.id);
    console.log('calling setuser');
    Router.setUser(event.currentTarget.id);
    console.log('called setuser');
  },
  'click .userInfo': function (evt) 
  {
        // prevent clicks on <a> from refreshing the page.
        console.log('prevent default');
        evt.preventDefault();

      }
    });

Template.detailKnacktivity.events(okCancelEvents(
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

Template.detailKnacktivity.rendered = function(){

  if(Session.get("selected")==undefined)
    return;

  var kEvent = knacktivity.findOne(Session.get("selected"));
 //load up an array of users that can be invited to this event
 //we want to grab the users that have not been invited
 var users = _.map(Meteor.users.find(
  {_id:{$nin:kEvent.invited}}).fetch(),
 function(user){
  var name = displayNameByID(user._id);
  return {id:user._id, text:name};
});

 //console.log(kEvent);
 $("#invitePeople").select2({
  placeholder:"Invite People",
  closeOnSelect:false,
  multiple:true,
  data:users
});
}

//*************************************
//comment display
Template.detailKnacktivity.events({
  'click .removeComment': function () {
    Meteor.call('removeComment', Session.get("selected"), event.currentTarget.id);
  }
});

Template.detailKnacktivity.userName = function(){
  var owner = Meteor.users.findOne(this.user);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
}

Template.detailKnacktivity.timestamp = function(){
  var ts = new Date(this.timestamp);
  return ts.toLocaleString();
};

Template.detailKnacktivity.commentCount = function(){
  if(this.comments.length>0)
    return this.comments.length + " Comments";
  else
    return "Comment on this!"
}

Template.detailKnacktivity.commentProfileImg = function(){
  var owner = Meteor.users.findOne(this.user);
  return profilePic(owner._id);
};

//********************************************
//modalEvent template

Template.modalEvent.events({
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
          //  openModalInvite();
        }
      });
      Session.set("showModalEvent", false);
      Session.set('createKnacktivity_tag',new Array());//clear this out for our next event we add
    } else {
      Session.set("createError",
        "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("createKnacktivity_tag", new Array());
    Session.set("showModalEvent", false);
  }
});


var openModalEvent = function(x, y){
  //Session.set("createCoords", {x: x, y: y});
  Session.set("createError", null);
  Session.set("showModalEvent", true);
};

Template.modalEvent.error = function () {
  return Session.get("createError");
};

Template.modalEvent.rendered = function(){
  $(".datePicker").datepicker({ minDate: new Date().now });
/*  $(".timeStart").timepicker();
$(".timeEnd").timepicker();*/
};

//************************************
//add_tag_knack template
//had to add this template to prevent create knacktivity
//dialog from breaking

Template.addTagKnack.events({
  'click .addtag-knack':function(event,template) {
    Session.set('editing_addtag_knack', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(template.find("#edittag-input-knack"));
  }
});

Template.addTagKnack.events(okCancelEvents(
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

Template.addTagKnack.tagKnacks = function(){
 var owner = Meteor.users.findOne(Meteor.userId());
 var owner_id = owner._id;
 return _.map( Session.get('createKnacktivity_tag') || [], function (tag) {
  return {owner_id: owner_id, tag: tag, tag_type:'knack_add'};
});
};

Template.addTagKnack.adding_tag_knack = function () {
  return Session.equals('editing_addtag_knack', this._id);
};

//***********************************
// Modal Sign Up / Sign In template

Template.modalSUSI.events({
  'click .done': function (event, template){
    //close modal susi
    Session.set("showModalSUSI",false);
  },
  'click .signIn': function(event, template){
    //attempt to log the user in to knacked
    var username = getValFromWatermark(template.find('#username'));
    var password = getValFromWatermark(template.find('#password'));
    Meteor.loginWithPassword(username, password, function(err){});
  }
});

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

var openModalInvite = function () {
  Session.set("showModalInvite", true);
};

Template.page.showModalInvite = function () {
  return Session.get("showModalInvite");
};

Template.modalInvite.events({
  'click .invite': function (event, template) {
    console.log(this._id);
    Meteor.call('invite', Session.get("selected"), this._id);
  },
  'click .done': function (event, template) {
    Session.set("showModalInvite", false);
    return false;
  }
});

Template.modalInvite.uninvited = function () {
  var affair = knacktivity.findOne(Session.get("selected"));
  if (! affair)
    return []; // affair hasn't loaded yet
  return Meteor.users.find({$nor: [{_id: {$in: affair.invited}},
   {_id: affair.owner}]});
};

Template.modalInvite.displayName = function () {
  return displayName(this);
};
//********************************
//  knack item template


Template.knackItem.knacks= function(){
  try{
    return this.tag;
  }catch(err){
    log_event(err, LogLevel.Error);
  }
}

Template.knackItem.events({
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

Template.detailUser.events({
  'click .followMe': function (evt) {//Follow another user
    if(Meteor.userId() != Session.get("user")){
      var val = new Array();
      val.push(Session.get("user"));

      Meteor.call('followSomeone', {
        followId: val
      });
    }
  }
  ,
    'click .unFollowMe': function (evt) {//Follow another user
      var val = new Array();
      val.push(Session.get("user"));
      Meteor.call('unFollowSomeone', {
        followId: val
      });
    }
    ,
    'mousedown .userInfo': function(event, template)
    {
    //Session.set("selected", event.currentTarget.id);
    console.log('calling setuser');
    Router.setUser(event.currentTarget.id);
    console.log('called setuser');
  },
  'click .userInfo': function (evt) 
  {
        // prevent clicks on <a> from refreshing the page.
        console.log('prevent default');
        evt.preventDefault();

      }
    });


Template.detailUser.myname = function(){
  var owner = Meteor.users.findOne(Session.get("user"));
  return displayName(owner);
};

Template.detailUser.shares = function(){
  owner = Meteor.users.findOne(Session.get("user"));
  return _.map(owner.tagShared || [], function (tag) {
    return {owner_id: owner._id, tag: tag, tag_type:'share'};
  });
};

Template.detailUser.wants = function(){
  var owner = Meteor.users.findOne(Session.get("user"));
  var owner_id = owner._id;
  return _.map(owner.tagWanted || [], function (tag) {
    return {owner_id: owner_id, tag: tag, tag_type:'want'};
  });
};

Template.detailUser.followers = function(){
  return Meteor.users.find({following:Session.get("user")});
};

Template.detailUser.following = function(){
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
Template.detailUser.currentlyFollowing = function(){
  var otherUser = Session.get("user");
  if(jQuery.inArray(otherUser,Meteor.users.findOne(Meteor.userId()).following)>=0)
    return true;
  else
    return false;
};

//*************************************
// user_list & user_array Templates

Template.userList.user = function(){
  return displayName(this);
};

Template.userList.userPicture = function(){
  var owner = Meteor.users.findOne(this);
  console.log(owner);
  return profilePic(owner,'');
};

Template.userArray.user = function(){
  var user = Meteor.users.findOne(this.uid);
  return displayName(user);
};

Template.userArray.userPicture = function(){
  var owner = Meteor.users.findOne(this.uid);
  return profilePic(owner,'');
};


////////// Tracking selections in URL //////////


var myRouter = Backbone.Router.extend({
  routes: {
    "knacktivity/:query":   "knacktivity",    // #kancktivity/knacktivity_id
    "search/:query":        "search",         // #search/beer
    "users/:query":         "users",           // #users/user_id
    "user/:query":         "user"           // #users/user_id
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
  user: function (user_name) {
    var user = Meteor.users.findOne({username:user_name});
    if(user != undefined){
      Session.set("user", user._id);
      Session.set("selected", null);
      Session.set("search_val", null);
    }
  },
  setKnacktivity: function (knacktivity_id) {
    this.navigate("/knacktivity/" + knacktivity_id, true);
  },
  setUser: function(user){
    console.log(user);
    this.navigate("/users/" + user, true);
  }
});

Router = new myRouter;

if (!Meteor.isServer) {
  Meteor.startup(function () {
    console.log('startup');
    Backbone.history.start({pushState: true});
    filepicker.setKey('AwUBcdgTGSjm7By4rI1oAz');
  });
}


