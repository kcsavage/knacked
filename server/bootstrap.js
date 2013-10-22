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

