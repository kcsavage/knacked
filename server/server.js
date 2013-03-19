
Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, tagWanted: 1, tagShared: 1, following: 1}});
});

Meteor.publish("knacktivity", function () {
  return knacktivity.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});
/*
Accounts.loginServiceConfiguration.remove({
  service: "google"
});*/