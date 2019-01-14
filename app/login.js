var frameModule = require("ui/frame");
var page; 
var password; 
var passwordField; 

var fs = require("file-system");
var fileName = "login.txt";
var file = fs.knownFolders.documents().getFile(fileName);

var app = require("tns-core-modules/application");


exports.loaded = function(args) {
    //creates variable for current screen
    var topmost = frameModule.topmost();
    
    
    page = args.object;
    console.log("CHECKING IF PERSON HAS LOGGED IN BEFORE!!");
    file.readText().then(function (content) {
        //user gets sent to list page if already logged in once, or app exits if navigating from the list 
        if(content != "" && content == "successful") {
            //console.log("GLOBAL LIST VIEW ON LOGIN IS " + global.listViewed); 
            if(global.listViewed) {
                //console.log("BEFORE EXITING THE VARIABLE IS " + global.listViewed);  
                global.listViewed = false;      
                if(app.ios) {
                    exit(0);
                } else if (app.android) {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            } else {
                topmost.navigate("announcements/announcements-list-page");
            }
        } else {
            console.log("PREVIOUS LOGIN NOT DETECTED!"); 
        } 
    })
};

exports.signIn = function() {

    var topmost = frameModule.topmost();

    //gets value of password entered by user 
    passwordField = page.getViewById("password");
    password = passwordField.text;   


    //verifies password and changes page if the password is correct 
    if(password == "tsstigers"){
        file.writeText("successful").then(function () {
            console.log("wrote to LOGIN TEXT FILE!" + fileName);
        })
        topmost.navigate("announcements/announcements-list-page");
    }  
     else{
        alert("Incorrect password. Please try again."); 
    }
};