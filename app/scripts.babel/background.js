/* global chrome */
'use strict';

var Background = function() {

    var NEW_POSITION_NOTIFICATION_ID = 'job-ninja-new-position';

    return {
        openPopup: function() {
            chrome.notifications.create(NEW_POSITION_NOTIFICATION_ID,
                {
                    type: 'basic',
                    title: '\'Test Job\' position was added to Job Ninja',
                    message: 'Click here to see on Job Ninja',
                    iconUrl: 'images/icon-38.png',
                    isClickable: true
                }
            );
            chrome.notifications.onClicked.addListener(function(notificationId) {
                if (notificationId === NEW_POSITION_NOTIFICATION_ID) {
                    chrome.notifications.clear(NEW_POSITION_NOTIFICATION_ID);
                    chrome.tabs.create({url: 'http://localhost:8080/#/position/56d7698fa826c8eec5a782bf'});
                }
            });
        }
    };
};

var background = new Background();

chrome.runtime.onMessage.addListener(function(request) {
    if (request.context === 'background') {
        if (background[request.method]) {
            background[request.method]();
        } else {
            throw 'Method ' + request.method + 'is not found in background component';
        }
    }
});