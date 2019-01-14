var webViewModule = require('ui/web-view');
var gridLayout = require('ui/layouts/grid-layout');

var AnnouncementDetailViewModel = require("./announcement-detail-view-model");
var frameModule = require("ui/frame");

var socialShare = require("nativescript-social-share");

var app = require("tns-core-modules/application");

var announcementText;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new AnnouncementDetailViewModel(page.navigationContext); //the navigationContext is the tapped announcement item from the list

    announcementText = page.bindingContext.announcement.announcement_text;
    announcementDate = page.bindingContext.announcement.announcementSentence; 
}

function pageLoaded(args) {
}
  

function onGoBack() {
    frameModule.topmost().goBack();
}

//sharing the announcements for that specific day using the pagebindingcontext (which was passed by the navigation function in the list view)
function onShare(args) {
    if (app.android) {
        socialShare.shareText("The announcements for " + announcementDate + " are: " + announcementText);
    } else if (app.ios) {
        socialShare.shareText("The announcements for " + announcementDate + " are: " + announcementText);
    }
}


function getScores(args){
     var topmost = frameModule.topmost();

     topmost.navigate("scores/scores");
}


exports.onShare = onShare;
exports.onNavigatingTo = onNavigatingTo;
exports.onGoBack = onGoBack;
exports.pageLoaded = pageLoaded;
exports.getScores = getScores; 
