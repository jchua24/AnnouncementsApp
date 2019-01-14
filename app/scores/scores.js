//variables needed to support offline functionality 
var Everlive = require('everlive-sdk'); //library that supports offline app usage 
var connectivity = require('connectivity');


var frameModule = require("ui/frame");
var page; 

var app = require("tns-core-modules/application");
var ScoreViewModel = require("./scores-view-model");

var scoreViewModel = new ScoreViewModel();

//required for share button to work
var socialShare = require("nativescript-social-share");

var frameModule = require("ui/frame");

function onNavigatingTo(args) {

    var page = args.object;

    page.bindingContext = scoreViewModel;
    scoreViewModel.empty();

    //if the device is offline, call the offlineLoad method, if not, load as per usual 
    if(connectivity.getConnectionType() === connectivity.connectionType.none) {
        //scoreViewModel.offlineLoad();    
    } else {
        scoreViewModel.load();
    }
} 


//refreshes list of announcements upon being refreshed 
function onPullToRefreshInitiated(args) {
    var page = args.object; 
    timer.setTimeout(function() {
    	scoreViewModel.empty();
        if(connectivity.getConnectionType() === connectivity.connectionType.none) {
            //scoreViewModel.offlineLoad();    
        } else {
             scoreViewModel.load();
         }
        page.notifyPullToRefreshFinished();
    }, 1000);
}

//sharing the announcements for that specific day using the pagebindingcontext (which was passed by the navigation function in the list view)
function onShare(args) {
    if (app.android) {
        socialShare.shareText("Download the official TSS Announcements App. Available now at: https://play.google.com/store/apps/details?id=ca.tssappclub.tssannouncements&hl=en and https://itunes.apple.com/ca/app/tss-announcements/id1271411385?mt=8");
    } else if (app.ios) {
        socialShare.shareText("Download the official TSS Announcements App. Available now at: https://play.google.com/store/apps/details?id=ca.tssappclub.tssannouncements&hl=en and https://itunes.apple.com/ca/app/tss-announcements/id1271411385?mt=8");
    }
}

exports.buttonTap = function() {
    scoreViewModel.load();
};

exports.onGoBack = function() {
    frameModule.topmost().goBack();
};

exports.onNavigatingTo = onNavigatingTo;
exports.onPullToRefreshInitiated = onPullToRefreshInitiated; 
exports.onShare = onShare; 