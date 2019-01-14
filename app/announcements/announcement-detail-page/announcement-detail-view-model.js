var Observable = require("data/observable").Observable;

function AnnouncementDetailViewModel(announcementModel) {
    var viewModel = new Observable();

    viewModel.announcement = announcementModel;

    return viewModel;
}

module.exports = AnnouncementDetailViewModel;