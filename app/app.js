/*
app.js serves as the app's point of entry 
*/
require("./bundle-config");

var application = require("application");

global.listViewed = false; 
//chooses the first page to display after the launch screen 
application.start({ moduleName: "login" });


