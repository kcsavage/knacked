
Meteor.publish("directory", function () {
	return Meteor.users.find({}, {fields: {emails: 1, profile: 1, tagWanted: 1, tagShared: 1, following: 1}});
});

Meteor.publish("knacktivity", function () {
	return knacktivity.find(
		{$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.publish("taxonomy", function () {
	return taxonomy.find();
});

Meteor.publish("FileSystem", function () {
	return FileSystem.find();
});



/*
Accounts.loginServiceConfiguration.remove({
  service: "google"
});*/

process.env.MAIL_URL = 'smtp://postmaster@knacked.mailgun.org:test123@smtp.mailgun.org'
/*smtp.mailgun.org
Login    : postmaster@knacked.mailgun.org
Password : 6un-uh2jrau8*/