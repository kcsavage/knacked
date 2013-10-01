
Meteor.subscribe("directory");
Meteor.subscribe("knacktivity");
Meteor.subscribe("taxonomy");

//********************************************
//session variables
Session.set('editing_addtag_want', null); 
Session.set('editing_addtag_share', null);
Session.set('editing_addtag_knack', null);
Session.set('selected', null); //selected knacktivity
Session.set('user', null); //selected user
Session.set('createKnacktivity_tag', new Array()); //array that holds knactivity tags before they save a new one
Session.set('search_val', null);