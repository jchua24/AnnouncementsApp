//variables needed to support offline functionality 
var Everlive = require('everlive-sdk'); //library that supports offline app usage 
var connectivity = require('connectivity');

var observableModule = require("data/observable");
var AnnouncementsListViewModel = require("./announcements-list-view-model");
var frameModule = require("ui/frame");
var timer = require("timer");

var socialShare = require("nativescript-social-share");

var app = require("tns-core-modules/application");


//variables needed for file system access and offline data 
var fs = require("file-system");
var fileName = "announcements.txt";
var file = fs.knownFolders.documents().getFile(fileName);

var announcementsListViewModel = new AnnouncementsListViewModel();


//if the app ever goes offline, then the Everlive package will handle this scenario 
var el = new Everlive({
    appId: 'ca.tssappclub.tssannouncements',
    offline: {
        storage: {
            provider: Everlive.Constants.StorageProvider.LocalStorage
        },
    }
});


function onNavigatingTo(args) {

    var page = args.object;

    global.listViewed = true;  

    
    console.log("GLOBAL LIST VIEW VARIABLE IS " + global.listViewed);

    page.bindingContext = announcementsListViewModel;
    announcementsListViewModel.empty();
    //if the device is offline, call the offlineLoad method, if not, load as per usual 
    if(connectivity.getConnectionType() === connectivity.connectionType.none) {
        console.log("CALLING OFFLINE LOAD"); 
        announcementsListViewModel.offlineLoad();    
    } else {
        console.log("CALLING ONLINE LOAD"); 
        announcementsListViewModel.load();
    }
} 

//when one of the items in the list has been tapped, navigate to the appropriate page 
function onAnnouncementItemTap(args) {
    var tappedAnnouncementItem = args.object.bindingContext;

    frameModule.topmost().navigate({
        moduleName: "announcements/announcement-detail-page/announcement-detail-page",
        context: tappedAnnouncementItem
    });
}

//refreshes list of announcements upon being refreshed 
function onPullToRefreshInitiated(args) {
    var page = args.object; 
    timer.setTimeout(function() {
    	announcementsListViewModel.empty();
        if(connectivity.getConnectionType() === connectivity.connectionType.none) {
            announcementsListViewModel.offlineLoad();    
        } else {
             announcementsListViewModel.load();
         }
        page.notifyPullToRefreshFinished();
    }, 1000);
}

function onShare(args) {
    if (app.android) {
        socialShare.shareText("Download the official TSS Announcements App. Available now at: https://play.google.com/store/apps/details?id=ca.tssappclub.tssannouncements&hl=en and https://itunes.apple.com/ca/app/tss-announcements/id1271411385?mt=8");
    } else if (app.ios) {
        socialShare.shareText("Download the official TSS Announcements App. Available now at: https://play.google.com/store/apps/details?id=ca.tssappclub.tssannouncements&hl=en and https://itunes.apple.com/ca/app/tss-announcements/id1271411385?mt=8");
    }
}


function getScores(args){
     var topmost = frameModule.topmost();

     topmost.navigate("scores/scores");
}

exports.onShare = onShare;
exports.onNavigatingTo = onNavigatingTo;
exports.onAnnouncementItemTap = onAnnouncementItemTap;
exports.onPullToRefreshInitiated = onPullToRefreshInitiated; 
exports.getScores = getScores; 