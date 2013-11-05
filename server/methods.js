
Meteor.methods({
  getUserPrivilages: function(options){
    var user = Meteor.users.findOne(options.user);
    if(user && user.privilages){
      return user.privilages;
    }
  },
  su:function(user){
    var user = Meteor.users.findOne(user);
    if(user && user.superUser){
      if (user.superUser == 1)
        return true;
      else
        return false;      
    }
  }
})
