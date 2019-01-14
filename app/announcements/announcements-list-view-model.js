var config = require("../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

var moment = require("moment");
var app = require("tns-core-modules/application");

//variables needed for file system access and offline data 
var fs = require("file-system");
var fileName = "announcements.txt";
var file = fs.knownFolders.documents().getFile(fileName);

//handles all the information that will be visible on the page
function AnnouncementsListViewModel() {
    var viewModel = new Observable();
    var weekday = "";
    var date; 
    var dateGood; 
    var announcementSentence;

    viewModel.isLoading = false;
    viewModel.announcements = new ObservableArray([]); //array of announcement objects 

    viewModel.load = function () {
        
        this.set("isLoading", true);

        console.log("inside loading function!!!!"); 

        //loops through table retrieved from database, and pushes each row of announcement data to the viewModel 
        fetch(config.apiUrl)
            .then(handleErrors)
            .then(function (response) {
                jsonData = response.json();
                console.log("Got the announcements json data: " + jsonData);
                return jsonData;
            }).then(function (data) {
               data.forEach(function(obj) { 
                   switch(obj.weekday) {
                    case "0": 
                        weekday = "Sunday" 
                        break;
                    case "1": 
                        weekday = "Monday"
                        break; 
                    case "2": 
                        weekday = "Tuesday"
                        break; 
                    case "3": 
                        weekday = "Wednesday" 
                        break;
                    case "4": 
                        weekday = "Thursday"
                        break; 
                    case "5": 
                        weekday = "Friday"
                        break;
                    case "6": 
                        weekday = "Saturday"
                        break;  
                    default: 
                        weekday = "Undetermined"
                        break; 
                   }

                   //converts date into human-readable string 
                   var date = moment(obj.announcement_date).format("dddd, MMMM Do YYYY");

                   //creates sentence that reads out human readable date 
                   announcementSentence = date; 

                   //pushes all announcement data to viewmodel object 
                   viewModel.announcements.push({
                        announcementSentence: announcementSentence, 
                        announcement_date: date, 
                        weekday: weekday,
                        announcement_html: obj.announcement_html,
                        announcement_text: obj.strippedText,
                        image_url: "~/images/" + obj.weekday + ".png"
                    });


                // Writing all the announcement data to a text file
                 file.writeText(JSON.stringify(data))
                      .then(function () {
                        console.log("SUCESSFULLY ADDED TO TEXT FILE " + fileName);

                        file.readText().then(function (content) {
                            console.log("FILE CONTENT READ!!");
                            //console.log("HERE IS THE CONTENT OF THE TEXT FILE: " + content);
                        }, function (error) {
                            console.log("CAN'T READ TEXT FROM FILE."); 
                    });
                 }, function (error) {
                    console.log("ERROR WRITING TO TEXT FILE.");
                });
             });
                viewModel.set("isLoading", false);
            }); 
        //viewModel.set("isLoading", false);
    }

    viewModel.empty = function () {
        while (this.announcements.length) {
            this.announcements.pop();
        }
    };

    //function is called when the user's device is not connected to a network 
    viewModel.offlineLoad = function () {
        if(app.ios){
            alert("Device is offline. Check your network connection.");
            return; 
        }
        this.set("isLoading", true);
        
        //reads the announcement data from the file that was previously written to 
        file.readText()
            .then(function (content) {
                var data = JSON.parse(content); 
                data.forEach(function(obj) { 
                   switch(obj.weekday) {
                    case "0": 
                        weekday = "Sunday" 
                        break;
                    case "1": 
                        weekday = "Monday"
                        break; 
                    case "2": 
                        weekday = "Tuesday"
                        break; 
                    case "3": 
                        weekday = "Wednesday" 
                        break;
                    case "4": 
                        weekday = "Thursday"
                        break; 
                    case "5": 
                        weekday = "Friday"
                        break;
                    case "6": 
                        weekday = "Saturday"
                        break;  
                    default: 
                        weekday = "hello"
                        break; 
                   }
    
                   //converts date into human-readable string 
                   var date = moment(obj.announcement_date).format("dddd, MMMM Do YYYY");

                   //creates sentence that reads out human readable date 
                   announcementSentence = date; 

                   //pushes all announcement data to viewmodel object 
                   viewModel.announcements.push({
                        announcementSentence: announcementSentence, 
                        announcement_date: date, 
                        weekday: weekday,
                        announcement_html: obj.announcement_html,
                        announcement_text: obj.strippedText,
                        image_url: "~/images/" + obj.weekday + ".png"
                    });

             });
            }, function (error) {
               alert("Error. Please check your network connection.")
        });
        viewModel.set("isLoading", false);
    }
    return viewModel; //returns viewModel object containing announcement data 
} 




function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
module.exports = AnnouncementsListViewModel;