/*
grab json from db like this:
 mongoexport -h localhost:3002 --db meteor --collection knacktivity --out knacktivity.json --journal
 mongoexport -h localhost:3002 --db meteor --collection users --out users.json --journal
 */

 /**************************************
 *          Bootstrap account login
 *                services
 ***************************************/
 Accounts.loginServiceConfiguration.remove({
 	service: "google"
 });
 Accounts.loginServiceConfiguration.insert({
 	service: "google",
 	clientId: "1075434149043-ujc86765oclogifjgm5jo0f9v72hhmcf.apps.googleusercontent.com",
 	secret: "ygg8GRoSKoW2jXRd7JwtUlS4"
 });

 Accounts.loginServiceConfiguration.remove({
 	service: "facebook"
 });
 Accounts.loginServiceConfiguration.insert({
 	service: "facebook",
 	appId: "173412099374898",
 	secret: "b1035d53506ece97efbac4da3d48a2f1"
 });


 /**************************************
 *          Bootstrap data in all
 *                collections
 *
 *  kcs- needed to remove '$date' from json and just use long timestamp field
 ***************************************/

 Meteor.startup(function () {
/* 	Meteor.users.remove({});
 	Meteor.users.insert(
 		[
 		{ "_id" : "gravPR6srZHxbiDvC", "createdAt" : 1382097845056, "emails" : [ { "address" : "kcsavage@gmail.com", "verified" : false } ], "services" : { "password" : { "srp" : { "identity" : "Hx7QfwL2dTxrCqn75", "salt" : "p58DeYdbsCntDqBNr", "verifier" : "ceea46a0ad965c4d4e22cf6f61ff0ac98d77372249889297f8b84ec6d6c2ec821030879af7f018265da0e4b041389aa71f9039b4dafe8a23741e7502a678e55302ead4eb27cb10f5471be2ce7b1952e4b5f033a979f0544774d5d6a5115dc9d6da6b53eb8b0a822d30cdebb7bbbfc0f071ef443db3a0f3d05768379745b02809" } }, "resume" : { "loginTokens" : [] } } },
 		{ "_id" : "qaGAERjqQ74PHtQtP", "company" : "Knacked", "createdAt" :1382105409220 , "description" : "Test", "email" : "Nome", "emails" : [ { "address" : "jdiez316@gmail.com", "verified" : false } ], "firstName" : "Jordan", "lastName" : "dIEZ", "services" : { "password" : { "srp" : { "identity" : "YBrqXxsrE5MvPHbKo", "salt" : "QmYTaPHhp6cYNCTH9", "verifier" : "a5e7af96fd5ef56aeca3ddfdd5eeabded0778a9bc3d600ab15ecc7ea44520b97e09cdb16dc411cf63c82f59c69f381ab353dda64fb451df974f996aea33abae78dbd888afe95b8c917b8e40bf7eb0000d55671ac7cda5c76cc92605cbb87f6414ca9b7a56a1ee56d171a1dc459f4f52a758c82f9dd5471e1e344884f57b41c26" } }, "resume" : { "loginTokens" : [] } }, "username" : "" }
 		]);
knacktivity.remove({}); 
knacktivity.insert(
	[
	{ "_id" : "BgYhGHNaGLkn7foTr", 
	"commenting" : true, 
	"comments" : 
	[ { "user" : "gravPR6srZHxbiDvC", "comment" : "test 123", "timestamp" : "Fri Oct 18 2013 08:07:35 GMT-0400 (EDT)", "flagged" : false, "deleted" : false } ], 
	"date" : "10/14/2013", 
	"description" : "abc123", 
	"invited" : [], 
	"knacks" : [ "test1", "test2" ], 
	"location" : "Jordan's house", 
	"owner" : "gravPR6srZHxbiDvC", 
	"public" : false, "rsvps" : [], 
	"timeEnd" : "900", 
	"timeStart" : "800", 
	"title" : "test" }, 
	{ "owner" : "qaGAERjqQ74PHtQtP", "title" : "Test2", "description" : "this is a test", "date" : "10/14/2013", "timeStart" : "900", "timeEnd" : "1000", "location" : "Nocation", "public" : true, "commenting" : false, "invited" : [], "rsvps" : [], "comments" : [], "knacks" : [], "_id" : "yCfdrtrvGadhxmdkW" }
	]
	);*/
}
)