var webViewModule = require('ui/web-view');
var gridLayout = require('ui/layouts/grid-layout');

var CarDetailViewModel = require("./car-detail-view-model");
var frameModule = require("ui/frame");

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new CarDetailViewModel(page.navigationContext);
}

 function pageLoaded(args) {
}
  

function onGoBack() {
    frameModule.topmost().goBack();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onGoBack = onGoBack;
exports.pageLoaded = pageLoaded;
