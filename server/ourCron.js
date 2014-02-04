/*************
*email users reminding them they're signed up for knacktivities
*this is used for daily reminders.
**************/
Meteor.setInterval(
	function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		today = mm+'/'+dd+'/'+yyyy;
		knacktivity.find({'date':{$gt : today }}).fetch()
		var docs = knacktivity.find({'rsvps.rsvp':'yes', 'date':{$gt:today}}).fetch();

		//send only confirmed users an email that they're signed up
		for (var i = 0; i < docs.length; i++) {
			var knackevent = docs[i]; 
			for (var x= 0; x < knackevent.rsvps.length; x++) {
				if(knackevent.rsvps[x].rsvp=="yes"){
					var userId = knackevent.rsvps[x].user;
					var to = contactEmail(Meteor.users.findOne(userId));
					if (Meteor.isServer && to) {
						Email.send({
							from: "tugboat@knacked.com",
							to: to,
							replyTo: "tugboat@knacked.com",
							subject: "event: " + knackevent.title,
							text:
							"Hey, I just invited you to '" + knackevent.title + "' on Knacked." + "\n" +
							knackevent.date + " @ " + knackevent.timeStart + "\n" +
							knackevent.location + "\n" +
							knackevent.description + "\n" +
							knackevent.knacks + "\n" +
							"\n\nCome check it out: " + Meteor.absoluteUrl() + "knacktivity/" + knackevent._id + "\n"
						});

						console.log("Sent email to: " + to);
					}
				}
			};
		};
/*

*/
},
8640000  //daily reminder
);
