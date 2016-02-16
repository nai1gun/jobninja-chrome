/* global $, chrome */
'use strict';

var JOB_POSTING_ELEMENT = '[itemtype="http://schema.org/JobPosting"]';

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('Got message');
        if (request.method === 'hasPosition') {
            sendResponse(hasPosition());
        } else if (request.method === 'grabPosition') {
            sendResponse(grabPosition());
        } else {
            console.log('Unrecognized message');
        }
    });

function hasPosition() {
    return new Boolean($(JOB_POSTING_ELEMENT)[0]);
}

function getJobPosting() {
    return $(JOB_POSTING_ELEMENT);
}

function getName() {
    return getJobPosting().find('[itemprop="title"]').text();
}

function getCompany() {
    return $('[itemtype="http://schema.org/Organization"]').find('[itemprop="name"]').text();
}

function getLocation() {
    return $('[itemtype="http://schema.org/PostalAddress"]').text();
}

function getHref() {
    return window.location.href;
}

function grabPosition() {
    var position = {
        name: getName(),
        company: getCompany(),
        location: getLocation(),
        link: getHref()
    };
    return position;
}