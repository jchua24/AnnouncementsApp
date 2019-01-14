var config = require("../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

var app = require("tns-core-modules/application");

//variables needed for file system access and offline data 
var fs = require("file-system");
var fileName = "scores.txt";
var file = fs.knownFolders.documents().getFile(fileName);

//handles all the information that will be visible on the page
function ScoreViewModel() {
    var viewModel = new Observable();
    var grade;
    var score; 

    viewModel.isLoading = false;

    viewModel.scores = new ObservableArray([]); //array of score objects 


    viewModel.getGrade9Score = function () {
        console.log ('viewModel.scores.length: ' + viewModel.scores.length);
        return viewModel.scores.length;    
    };

    viewModel.load = function () {
        this.set("isLoading", true);

        //loops through table retrieved from database, and pushes each row of score data to the viewModel 
        fetch(config.scoresUrl)
            .then(handleErrors)
            .then(function (response) {
                jsonData = response.json();
                console.log("Got the scores json data: " + jsonData);
                return jsonData;
            }).then(function (data) {
               data.forEach(function(obj) { 
                    //console.log ('>>>>>>>>>>>>>>>>> score object: ' + obj.grade + ' ' + obj.score );

                   //pushes all announcement data to viewmodel object 
                   viewModel.scores.push({
                        grade: obj.grade, 
                        score: obj.score
                    });

                    //workaround logic used since databinding is not working
                    if (obj.grade == "9") viewModel.set('grade9Score',  obj.score);
                    if (obj.grade == "10") viewModel.set('grade10Score',  obj.score);
                    if (obj.grade == "11") viewModel.set('grade11Score',  obj.score);
                    if (obj.grade == "12") viewModel.set('grade12Score',  obj.score);

                    
                // Writing all the score data to a text file
                 /*file.writeText(JSON.stringify(data))
                      .then(function () {
                        console.log("SUCCESSFULLY ADDED TO TEXT FILE " + fileName);

                        file.readText().then(function (content) {
                            console.log("FILE CONTENT READ!!");
                            //console.log("HERE IS THE CONTENT OF THE TEXT FILE: " + content);
                        }, function (error) {
                            console.log("CAN'T READ TEXT FROM FILE."); 
                    });
                 }, function (error) {
                    console.log("ERROR WRITING TO TEXT FILE.");
                }); */

             });
                //viewModel.set("isLoading", false);
            });
    }

    viewModel.empty = function () {
        while (this.scores.length) {
            this.scores.pop();
        }
    };
    
    return viewModel; //returns viewModel object containing score data 
} 




function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
module.exports = ScoreViewModel;