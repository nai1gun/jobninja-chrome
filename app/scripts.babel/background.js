/* global chrome, $ */
'use strict';


function ifDefined(value) {
    return value === 'undefined' ? undefined : value;
}

var config = {
    apiBaseUrl: ifDefined('/* @echo jobNinja.api.baseUrl */')
};

var Background = function() {

    var NEW_POSITION_NOTIFICATION_ID = 'job-ninja-new-position';

    var getHeaders = function(callback) {
        chrome.storage.local.get('token', function(result) {
            var headers = {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8'
            };
            var token = (result && result.token) ? result.token : null;
            if (token && token.expires_at && token.expires_at > new Date().getTime()) {
                headers.Authorization = 'Bearer ' + token.access_token;
            }
            callback(headers);
        });
    };

    var doSavePosition = function(position, callback) {
        getHeaders(function(headers) {
            $.ajax({
                url: config.apiBaseUrl + 'api/positions',
                method: 'POST',
                headers: headers,
                data: JSON.stringify(position)
            }).done(function(createdPosition) {
                callback(createdPosition);
            });
        });
    };

    var createNotification = function(position) {
        chrome.notifications.create(NEW_POSITION_NOTIFICATION_ID,
            {
                type: 'basic',
                title: `\'${position.name}\' position was added to Job Ninja`,
                message: 'Click here to see on Job Ninja',
                iconUrl: 'images/icon-128.png',
                isClickable: true
            }
        );
        chrome.notifications.onClicked.addListener(function(notificationId) {
            if (notificationId === NEW_POSITION_NOTIFICATION_ID) {
                chrome.notifications.clear(NEW_POSITION_NOTIFICATION_ID);
                chrome.tabs.create({url: `${config.apiBaseUrl}#/position/${position.id}`});
            }
        });
    };

    return {
        savePosition: function(params) {
            if (!(params && params.position)) {
                throw 'No \'position\' param';
            }
            doSavePosition(params.position, function(createdPosition) {
                createNotification(createdPosition);
            });
        }
    };
};

var background = new Background();

chrome.runtime.onMessage.addListener(function(request) {
    if (request.context === 'background') {
        if (background[request.method]) {
            background[request.method](request.params);
        } else {
            throw `Method ${request.method} is not found in background component`;
        }
    }
});