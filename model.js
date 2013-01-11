var knacktivity = new Meteor.Collection("knacktivity");

Meteor.methods({
  createKnacktivity: function(options){
    options = options || {};
    return knacktivity.insert({
      owner: this.userId,
      title: options.title,
      description: options.description,
      public: !! options.public
    });
  }
});