var config = require("../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;


//variables needed for file system access and offline data 
var fs = require("file-system");
var fileName = "announcements.txt";
var file = fs.knownFolders.documents().getFile(fileName);

//handles all the information that will be visible on the page
function CarsListViewModel() {
    var viewModel = new Observable();
    var weekday = ""
    var date; 
    var dateGood; 
    var announcementSentence;

    viewModel.isLoading = false;
    viewModel.cars = new ObservableArray([]); //array of announcement objects 

    viewModel.load = function () {
        this.set("isLoading", true);

        //loops through table retrieved from database, and pushes each row of announcement data to the viewModel 
        fetch(config.apiUrl)
            .then(handleErrors)
            .then(function (response) {
                return response.json();
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
                        weekday = "hello"
                        break; 
                   }

                   //converts date into human-readable string 
                   date = new Date(obj.announcement_date + "GMT-0500");
                   dateGood = date.toDateString();  

                   //creates sentence that reads out human readable date 
                   announcementSentence = "Announcements for " + dateGood; 

                   //pushes all announcement data to viewmodel object 
                   viewModel.cars.push({
                        announcementSentence: announcementSentence, 
                        announcement_date: dateGood, 
                        weekday: weekday,
                        announcement_html: obj.announcement_html,
                        image_url: "~/images/" + obj.weekday + ".png"
                    });

                          
                // Writing all the announcement data to a text file
                 file.writeText(JSON.stringify(data))
                      .then(function () {
                        console.log("SUCESSFULLY ADDED TO TEXT FILE!");

                        file.readText()
                        .then(function (content) {
                            console.log("HERE IS THE CONTENT OF THE TEXT FILE: " + content)
                        }, function (error) {
                            console.log("CAN'T READ TEXT FROM FILE"); 
                    });
                 }, function (error) {
                    console.log("DID NOT ADD TO TEXT FILE.")
                });
             });
                viewModel.set("isLoading", false);
            });
    }

    viewModel.empty = function () {
        while (this.cars.length) {
            this.cars.pop();
        }
    };

    //function is called when the user's device is not connected to a network 
    viewModel.offlineLoad = function () {
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

                   date = new Date(obj.announcement_date + "GMT-0500");
                   console.log("THIS IS THE DATE BEING PASSED: " + date)

                   dateGood = date.toDateString();  

                     viewModel.cars.push({
                        announcement_date: dateGood, 
                        weekday: weekday,
                        announcement_html: obj.announcement_html,
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
module.exports = CarsListViewModel;