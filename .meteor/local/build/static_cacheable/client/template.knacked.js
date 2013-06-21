(function(){ Meteor.startup(function(){document.body.appendChild(Spark.render(Meteor._def_template(null,Handlebars.json_ast_to_func([[">","page"]]))));});Meteor._def_template("page",Handlebars.json_ast_to_func([["#",[[0,"if"],[0,"showCreateDialog"]],["\n\t",[">","createDialog"],"\n\t"]],"\n\n\t",["#",[[0,"if"],[0,"showInviteDialog"]],["\n\t",[">","inviteDialog"],"\n\t"]],"\n\n\t",["#",[[0,"if"],[0,"showUserProfile"]],["\n\t",[">","user_profile"],"\n\t"]],"\n\n\n\t\n\t<div class=\"mainContainer\">\n\t\t<div class=\"topBar\">\n\t\t\t<div class=\"topLogoSearch\">\n\t\t\t\t<img src=\"/logo.png\" class=\"logoImg\">\n\t\t\t\t<input type=\"text\" class=\"search\" />\n\t\t\t</div>\n\t\t\t<div class = \"topLogin\">\n\t\t\t\t",["{",[[0,"loginButtons"],{"align":"left"}]],"\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"contentArea\">\n\t\t\t<div class=\"\">\n\t\t\t\t<div class=\"sidebar-nav-fixed sideBar\">\n\t\t\t\t\t<a href = \"#\" class=\"add\">\n\t\t\t\t\t\t<img src=\"/addknack.png\" class=\"linkButtonImg\">\n\t\t\t\t\t</a>\n\t\t\t\t\t<!-- <input type=\"button\" class=\"add\" value=\"BIG+\" /><br><br> -->\n\t\t\t\t\t<a href = \"#\" class=\"showUser\">\n\t\t\t\t\t\t<img src=\"/profile.png\" class=\"linkButtonImg\">\n\t\t\t\t\t</a>\n\t\t\t\t\t<!-- <input type=\"button\" class=\"showUser\" value=\"Profile\" /> <br><br> -->\n\t\t\t\t\t<a href = \"#\" class=\"Contacts\">\n\t\t\t\t\t\t<img src=\"/contacts.png\" class=\"linkButtonImg\">\n\t\t\t\t\t</a>\n\t\t\t\t\t<!-- <input type=\"button\" class=\"showUser\" value=\"Peoples\" /> -->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"middle\" >\n\t\t\t\t<div class=\"searchQuery\">",["!",[[0,"searchQuery"]]]," </div>\n\t\t\t\t",["#",[[0,"each"],[0,"myEvent"]],["\n\t\t\t\t",[">","myEvents"],"\n\t\t\t\t"]],"\n\t\t\t</div>\n\t\t\t<div class=\"right\">\n\t\t\t\t",[">","details"],"\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<svg height=\"0\" xmlns=\"http://www.w3.org/2000/svg\" >\n\t\t<filter id=\"drop-shadow\">\n\t\t\t<feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"4\"/>\n\t\t\t<feOffset dx=\"2\" dy=\"2\" result=\"offsetblur\"/>\n\t\t\t<feFlood flood-color=\"rgba(0,0,0,0.75)\"/>\n\t\t\t<feComposite in2=\"offsetblur\" operator=\"in\"/>\n\t\t\t<feMerge>\n\t\t\t\t<feMergeNode/>\n\t\t\t\t<feMergeNode in=\"SourceGraphic\"/>\n\t\t\t</feMerge>\n\t\t</filter>\n\t</svg>"]));
Meteor._def_template("myEvents",Handlebars.json_ast_to_func(["<div class=\"teaser getDescription\" id=\"",["{",[[0,"myID"]]],"\">\n\t\t<div>\n\t\t\t<img src=\"/",["{",[[0,"profileImg"]]],"\" class=\"teaserImg\"> \n\t\t\t<ul class=\"titleName\">\n\t\t\t\t<li>\n\t\t\t\t\t<div class=\"eventTitle\">",["{",[[0,"myTitle"]]],"</div>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<div class=\"inlineDiv\">by: ",["!",[[0,"usersName"]]],"</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<img src=\"/camera.png\" class=\"teaserPicImg\"> \n\t\t</div>\n\t\t<div class=\"desc\">\n\t\t\t",["{",[[0,"description"]]],"\n\t\t</div>\n\t\t<div class=\"noEditKnackTags\">\n\t\t\t",["#",[[0,"each"],[0,"knacktivityTags"]],["\n\t\t\t",[">","no_edit_knack_item"],"\n\t\t\t"]],"\n\t\t</div>\n\t\t<div class=\"locDateTime\">\n\t\t\t<div class=\"loc\">",["{",[[0,"location"]]],"</div>\n\t\t\t<div class=\"dateTime\">",["{",[[0,"date"]]]," ",["{",[[0,"time"]]],"</div>\n\t\t</div>\n\t\t<br>\n\t</div>"]));
Meteor._def_template("createDialog",Handlebars.json_ast_to_func(["<div class=\"mask\"> </div>\n\t<div class=\"modal\">\n\t\t<div class=\"modal-header\">\n\t\t\t<button type=\"button\" class=\"close cancel\">&times;</button>\n\t\t\t<h3>Add Knacktivity</h3>\n\t\t</div>\n\n\t\t<div class=\"modal-body\">\n\t\t\t",["#",[[0,"if"],[0,"error"]],["\n\t\t\t<div class=\"alert alert-error\">",["{",[[0,"error"]]],"</div>\n\t\t\t"]],"\n\n\t\t\t<label>Title</label>\n\t\t\t<input type=\"text\" class=\"title div5\">\n\n\t\t\t<label>Description</label>\n\t\t\t<textarea class=\"description div5\"></textarea>\n\n\t\t\t<label>Date</label>\n\t\t\t<input type=\"text\" id=\"datePicker\" class=\"datePicker\" />\n\n\t\t\t<label>Time</label>\n\t\t\t<input type=\"text\" id=\"timeStart\" class=\"timeStart\"/>\n\t\t\t<input type=\"text\" id=\"timeEnd\" class =\"timeEnd\"/>\n\n\t\t\t<label>Location</label>\n\t\t\t<input type=\"text\" class=\"location div5\" />\n\n\t\t\t<label>Knacks</label>\n\t\t\t<!-- <input type=\"text\" class=\"knacks div5\" /> -->\n\t\t\t",[">","add_tag_knack"],"\n\t\t\t\n\t\t\t<br>\n\t\t\t<br>\n\t\t\t<label class=\"checkbox\">\n\t\t\t\t<input type=\"checkbox\" class=\"private\">\n\t\t\t\tPrivate event &mdash; invitees only\n\t\t\t</label>\n\t\t\t<label class=\"checkbox\">\n\t\t\t\t<input type=\"checkbox\" class=\"commenting\">\n\t\t\t\tAllow Commenting\n\t\t\t</label>\n\t\t</div>\n\n\t\t<div class=\"modal-footer\">\n\t\t\t<a href=\"javascript:void(0)\" class=\"btn cancel\">Cancel</a>\n\t\t\t<a href=\"javascript:void(0)\" class=\"btn btn-primary save\">Add Knacktivity</a>\n\t\t</div>\n\t</div>"]));
Meteor._def_template("add_tag_knack",Handlebars.json_ast_to_func(["<ul id=\"knack-list\">\n\t\t<li>\n\t\t\t",["#",[[0,"if"],[0,"adding_tag_knack"]],["\n\t\t\t<div class=\"knack edittag-knack\">\n\t\t\t\t<input type=\"text\" id=\"edittag-input-knack\" value=\"\" />\n\t\t\t</div>\n\t\t\t"],["\n\t\t\t<div class=\"knack addtag-knack\">\n\t\t\t\t+knack\n\t\t\t</div>\n\t\t\t"]],"\n\t\t</li>\n\t\t",["#",[[0,"each"],[0,"tagKnacks"]],["\n\t\t",[">","knack_item"],"\n\t\t"]],"\n\t</ul>"]));
Meteor._def_template("details",Handlebars.json_ast_to_func(["<div class=\"details\">\n\t\t",["#",[[0,"if"],[0,"knacktivity"]],["\n\t\t",["#",[[0,"with"],[0,"knacktivity"]],["\n\t\t<div class=\"detailsLocDateTime\">\n\t\t\t<div class=\"detailsLocation inlineDiv\">\n\t\t\t\t<img src=\"/pin.png\">\n\t\t\t\t",["{",[[0,"location"]]],"\n\t\t\t</div>\n\t\t\t<div class=\"details-rsvp-buttons inlineDiv\">\n\t\t\t\t",["#",[[0,"if"],[0,"currentUser"]],["\n\t\t\t\tGoing?\n\t\t\t\t<input type=\"button\" value=\"Yes\"\n\t\t\t\tclass=\"btn btn-small rsvp_yes ",["{",[[0,"maybeChosen"],"yes"]],"\">\n\t\t\t\t<input type=\"button\" value=\"No\"\n\t\t\t\tclass=\"btn btn-small rsvp_no ",["{",[[0,"maybeChosen"],"no"]],"\">\n\t\t\t\t"],["\n\t\t\t\t<i>Sign in to RSVP</i>\n\t\t\t\t"]],"\n\t\t\t</div>\n\t\t\t\n\t\t</div>\n\n\t\t<div class=\"detailsInfo\">\n\t\t\t<div class=\"detailsTitle\">\n\t\t\t\t",["{",[[0,"title"]]],"\n\t\t\t</div> \n\t\t\t<div>\n\t\t\t\t<img src=\"/",["{",[[0,"profileImg"]]],"\" class=\"detailsProfilePic\">\n\t\t\t</div>\n\t\t\t<div class=\"detailsCreator\">\n\t\t\t\t",["!",[[0,"creatorName"]]],"\n\t\t\t</div>\n\t\t\t<div class=\"detailsDateTime\">\n\t\t\t\t",["{",[[0,"date"]]]," @ ",["{",[[0,"time"]]],"\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"detailsBar\">\n\n\t\t\t<div class=\"noEditKnackTags\">\n\t\t\t\tKnacks:\n\t\t\t\t",["#",[[0,"each"],[0,"knacktivityTags"]],["\n\t\t\t\t",[">","no_edit_knack_item"],"\n\t\t\t\t"]],"\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"detailsDescription\">",["{",[[0,"description"]]],"</div>\n\n\t\t<div class=\"blockDiv\">\n\t\t\t<div class=\"detailsStudents\">\n\t\t\t\t<div class=\"detailsBar detailsStudentsBar\">Students\n\t\t\t\t",["{",[[0,"numGoing"]]]," going\n\t\t\t\t",["{",[[0,"numInvited"]]]," invited\n\t\t\t\t<input type =\"text\" id=\"invitePeople\"/>\n\t\t\t\t</div>\n\n\t\t\t\t",[">","attendance"],"\n\t\t\t</div>\n\n\t\t\t<!-- <div class=\"detailsSimilar\">\n\t\t\t\t<div class=\"detailsBar detailsSimilarBar\">similar knacktivities</div>\n\t\t\t\tneed to come up with an awesome algorithm\n\t\t\t</div> -->\n\t\t</div>\n<!-- \t\t<br>\n\t\t<input type=\"button\" value=\"Post to facebook\" onclick=\"postCreate();\" class=\"fbPostCreate\">\n\t\t<div id=\"result\"></div> -->\n\n\t\t",["#",[[0,"if"],[0,"canRemove"]],["\n\t\t<div class=\"alert\">\n\t\t\t<small>\n\t\t\t\tYou posted this knacktivity and nobody is signed up to go, so if\n\t\t\t\tyou like, you could\n\t\t\t\t<b><a href=\"javascript:void(0)\" class=\"removeListing\">delete this listing</a></b>.\n\t\t\t</small>\n\t\t</div>\n\t\t"]],"\n\n\t\t",["#",[[0,"if"],[0,"commenting"]],["\n\t\t<div class=\"commentCounter detailsBar\">\n\t\t\t",["{",[[0,"commentCount"]]],"\n\t\t</div>\n\t\t",["#",[[0,"each"],[0,"comments"]],["\n\t\t<div id=\"commentBlock\">\n\t\t\t<img src=\"/",["{",[[0,"commentProfileImg"]]],"\" class=\"commentImg\">\n\t\t\t<div class=\"commentRight\">\n\t\t\t\t<div class=\"commentBar inlineBlock\">\n\t\t\t\t\t<div class=\"commentUser\">\n\t\t\t\t\t\t",["!",[[0,"userName"]]],"\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"commentTime\">\n\t\t\t\t\t\t<a href=\"javascript:void(0)\" class=\"flagComment commentCommands\" id =\"",["{",[[0,"_id"]]],"\">\n\t\t\t\t\t\t\t<img src=\"/grayflag.png\" class=\"flag\"></a>\n\t\t\t\t\t\t\t",["{",[[0,"timestamp"]]],"\n\t\t\t\t\t\t\t<a href=\"javascript:void(0)\" class=\"removeComment commentCommands\" id=\"",["{",[[0,"_id"]]],"\">x</a>\n\t\t\t\t\t\t\t&nbsp;\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class = \"comment inlineBock\">\n\t\t\t\t\t\t",["{",[[0,"comment"]]],"\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t"]],"\n\t\t\t",["#",[[0,"if"],[0,"currentUser"]],["\n\t\t\tenter new comment: <br>\n\t\t\t<input type=\"textbox\" id=\"add-comment\">\n\t\t\t"]],"\n\t\t\t"]],"\n\n\n\t\t\t"]],"\n\t\t\t"],["\n\t\t\t",["#",[[0,"if"],[0,"user"]],["\n\t\t\t",[">","user_profile_view"],"\n\t\t\t"],["\n\n\t\t\t<h1 class=\"muted pagination-centered\">\n\t\t\t\t",["#",[[0,"if"],[0,"anyKnacktivity"]],["\n\t\t\t\tClick a knacktivity to select it\n\t\t\t\t"],["\n\t\t\t\tSign in and click add knacktivity to make a new knacked event\n\t\t\t\t"]],"\n\t\t\t</h1>\n\t\t\t"]],"\n\t\t\t"]],"\n\n\n\t\t</div>"]));
Meteor._def_template("attendance",Handlebars.json_ast_to_func(["<div class=\"attendance well well-small\">\n\t\t\t<div class=\"muted who\"><b>Who</b></div>\n\t\t\t",["#",[[0,"if"],[0,"public"]],["\n\t\t\t<div>\n\t\t\t\t<b>Everyone</b>\n\t\t\t\t<span class=\"label label-inverse pull-right\">Invited</span>\n\t\t\t</div>\n\t\t\t"]],"\n\n\t\t\t",["#",[[0,"each"],[0,"rsvps"]],["\n\t\t\t<div class=\"rsvpProfilePerson \">\n\t\t\t\t<img src=\"/",["{",[[0,"invitationProfileImg"]]],"\" class=\"rsvpProfilePic rsvpGoing\" title=\"",["!",[[0,"invitationName"]]],"\">Going\n\t\t\t</div>\n\t\t\t"]],"\n\n\t\t\t",["#",[[0,"unless"],[0,"public"]],["\n\t\t\t",["#",[[0,"each"],[0,"outstandingInvitations"]],["\n\t\t\t<div class=\"rsvpProfilePerson \">\n\t\t\t\t<img src=\"/",["{",[[0,"rsvpProfileImg"]]],"\" class=\"rsvpProfilePic rsvpInvited\" title=\"",["!",[[0,"rsvpName"]]],"\">\n\t\t\t</div>\n\t\t\t"]],"\n\t\t\t"]],"\n\n\t\t\t",["#",[[0,"if"],[0,"nobody"]],["\n\t\t\t<div>Nobody.</div>\n\t\t\t"]],"\n\n\n\n\t\t</div>"]));
Meteor._def_template("inviteDialog",Handlebars.json_ast_to_func(["<div class=\"mask\"> </div>\n\t\t<div class=\"modal\">\n\t\t\t<div class=\"modal-header\">\n\t\t\t\t<button type=\"button\" class=\"close done\">&times;</button>\n\t\t\t\t<h3>Invite people</h3>\n\t\t\t</div>\n\n\t\t\t<div class=\"modal-body\">\n\t\t\t\t",["#",[[0,"each"],[0,"uninvited"]],["\n\t\t\t\t<div class=\"invite-row\">\n\t\t\t\t\t<a href=\"javascript:void(0)\" class=\"btn invite\">Invite</a>\n\t\t\t\t\t",["!",[[0,"displayName"]]],"\n\t\t\t\t</div>\n\t\t\t\t"],["\n\t\t\t\tEveryone on the site has already been invited.\n\t\t\t\t"]],"\n\t\t\t</div>\n\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<a href=\"javascript:void(0)\" class=\"btn btn-primary done\">Done</a>\n\t\t\t</div>\n\t\t</div>"]));
Meteor._def_template("user_profile",Handlebars.json_ast_to_func(["<div class=\"mask\"> </div>\n\t\t<div class=\"modal\">\n\t\t\t<div class=\"modal-header\">\n\t\t\t\t<button type=\"button\" class=\"close cancel\">&times;</button>\n\t\t\t\t<h3>User Profile</h3>\n\t\t\t</div>\n\t\t\t<div class=\"modal-body\">\n\t\t\t\t<div class=\"email\">",["{",[[0,"email"]]],"</div>\n\t\t\t\t<div class=\"\">\n\t\t\t\t\tshares\n\t\t\t\t\t<ul id=\"knack-list\">\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t",["#",[[0,"if"],[0,"adding_tag_share"]],["\n\t\t\t\t\t\t\t<div class=\"knack edittag-share\">\n\t\t\t\t\t\t\t\t<input type=\"text\" id=\"edittag-input-share\" value=\"\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"],["\n\t\t\t\t\t\t\t<div class=\"knack addtag-share\">\n\t\t\t\t\t\t\t\t+knack\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"]],"\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t",["#",[[0,"each"],[0,"tagShares"]],["\n\t\t\t\t\t\t",[">","knack_item"],"\n\t\t\t\t\t\t"]],"\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"\">\n\t\t\t\t\twants\n\n\t\t\t\t\t<ul id=\"knack-list\">\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t",["#",[[0,"if"],[0,"adding_tag_want"]],["\n\t\t\t\t\t\t\t<div class=\"knack edittag-want\">\n\t\t\t\t\t\t\t\t<input type=\"text\" id=\"edittag-input-want\" value=\"\" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"],["\n\t\t\t\t\t\t\t<div class=\"knack addtag-want\">\n\t\t\t\t\t\t\t\t+knack\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t"]],"\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t",["#",[[0,"each"],[0,"tagWants"]],["\n\t\t\t\t\t\t",[">","knack_item"],"\n\t\t\t\t\t\t"]],"\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t",[">","queControl"],"\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n\t\t\t\t<a href=\"javascript:void(0)\" class=\"btn cancel\">Cancel</a>\n\t\t\t\t<a href=\"javascript:void(0)\" class=\"btn btn-primary save\">Save</a>\n\t\t\t</div>\n\t\t</div>"]));
Meteor._def_template("user_profile_view",Handlebars.json_ast_to_func(["name: ",["!",[[0,"myname"]]],"\n\t\tshares: \n\t\t",["#",[[0,"each"],[0,"shares"]],["\n\t\t",[">","no_edit_knack_item"],"\n\t\t"]],"\n\t\twants: \t\t",["#",[[0,"each"],[0,"wants"]],["\n\t\t",[">","no_edit_knack_item"],"\n\t\t"]],"\n\t\t<br>\n\t\tfollowers:\n\t\t",["#",[[0,"each"],[0,"followers"]],["\n\t\t<ul>\n\t\t\t",[">","user_list"],"\n\t\t</ul>\n\t\t"]],"\n\t\t<br>\n\n\t\tfollowing:  \n\t\t",["#",[[0,"each"],[0,"following"]],["\n\t\t<ul>\n\t\t\t",[">","user_array"],"\n\t\t</ul>\n\t\t"]],"<br>\n\t\t\n\t\t",["#",[[0,"if"],[0,"currentUser"]],["\n\t\t\t",["#",[[0,"if"],[0,"currentlyFollowing"]],["\n\t\t\t<a href=\"javascript:void(0)\" class=\"unFollowMe\">Stop following me!!!!</a> <br>\t\n\t\t\t"],["\n\t\t\t<a href=\"javascript:void(0)\" class=\"followMe\">Follow me!!!!</a> <br>\n\t\t\t"]],"\n\t\t"]]]));
Meteor._def_template("user_list",Handlebars.json_ast_to_func(["<li>\n\t\t\t",["!",[[0,"user"]]],"\n\t\t</li>"]));
Meteor._def_template("user_array",Handlebars.json_ast_to_func(["<li>\n\t\t\t",["!",[[0,"user"]]],"\n\t\t</li>"]));
Meteor._def_template("knack_item",Handlebars.json_ast_to_func(["<li class=\"\">\n\t\t\t<div class=\"knack removable_knack\">\n\t\t\t\t<div class=\"name\">",["{",[[0,"knacks"]]],"</div>\n\t\t\t\t<div class=\"remove\">-</div>\n\t\t\t</div>\n\t\t</li>"]));
Meteor._def_template("no_edit_knack_item",Handlebars.json_ast_to_func(["<span class=\"no-edit-knack\">\n\t\t\t",["{",[[0,"tag"]]],"\n\t\t</span>"]));
Meteor._def_template("queControl",Handlebars.json_ast_to_func(["<h3>Select file(s) to upload:</h3>\n\t\t<input name=\"files\" type=\"file\" class=\"fileUploader\" multiple>\n\t\t<div class=\"fileRes\"></div>\n\t\t",[">","fileTable"]]));
Meteor._def_template("fileTable",Handlebars.json_ast_to_func([["#",[[0,"each"],[0,"Files"]],["\n\t\t<a class=\"btn btn-primary btn-mini btnFileSaveAs\">Save as</a>",["{",[[0,"filename"]]],"<br/>\n\t\t<img src=\"/",["{",[[0,"file"]]],"\">\n\t\t"],["\n\t\tNo files uploaded\n\t\t"]]]));
Meteor._def_template("scratchPad",Handlebars.json_ast_to_func([["!",[[0,"rsvpName"]]],"\n\t\t",["#",[[0,"if"],[0,"rsvpIs"],"yes"],["\n\t\t<span class=\"label label-success pull-right\">Going</span>\n\t\t"]],"\n\t\t",["#",[[0,"if"],[0,"rsvpIs"],"maybe"],["\n\t\t<span class=\"label label-info pull-right\">Maybe</span>\n\t\t"]],"\n\t\t",["#",[[0,"if"],[0,"rsvpIs"],"no"],["\n\t\t<span class=\"label label pull-right\">No</span>\n\n\t\t"]]]));

}).call(this);
