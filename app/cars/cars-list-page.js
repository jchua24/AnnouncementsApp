//variables needed to support offline functionality 
var Everlive = require('everlive-sdk'); //library that supports offline app usage 
var connectivity = require('connectivity');

var observableModule = require("data/observable");
var CarsListViewModel = require("./cars-list-view-model");
var frameModule = require("ui/frame");
var timer = require("timer");

//variables needed for file system access and offline data 
var fs = require("file-system");
var fileName = "announcements.txt";
var file = fs.knownFolders.documents().getFile(fileName);

var carsListViewModel = new CarsListViewModel();

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

    page.bindingContext = carsListViewModel;

    //if the device is offline, call the offlineLoad method, if not, load as per usual 
    if(connectivity.getConnectionType() === connectivity.connectionType.none) {
        carsListViewModel.offlineLoad();    
    } else {
        carsListViewModel.empty();
        carsListViewModel.load();
    }
} 

//when one of the items in the list has been tapped, navigate to the appropriate page 
function onCarItemTap(args) {
    var tappedCarItem = args.object.bindingContext;

    frameModule.topmost().navigate({
        moduleName: "cars/car-detail-page/car-detail-page",
        context: tappedCarItem
    });
}

//refreshes list of announcements upon being refreshed 
function onPullToRefreshInitiated(args) {
    var page = args.object; 
    timer.setTimeout(function() {
        if(connectivity.getConnectionType() === connectivity.connectionType.none) {
            carsListViewModel.offlineLoad();    
        } else {
             carsListViewModel.empty();
            carsListViewModel.load();
         }
        page.notifyPullToRefreshFinished();
    }, 1000);
}

exports.onNavigatingTo = onNavigatingTo;
exports.onCarItemTap = onCarItemTap;
exports.onPullToRefreshInitiated = onPullToRefreshInitiated; 