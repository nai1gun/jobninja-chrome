/* global $, chrome */
'use strict';


var DateUtils = function () {
    return {
        convertLocaleDateToServer: function(date) {
            if (date) {
              return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                  date.getHours(), date.getMinutes(), date.getSeconds()));
            } else {
              return null;
            }
        },
        convertLocaleDateFromServer: function(date) {
            if (date) {
              var dateString = date.split('-');
              return new Date(dateString[0], dateString[1] - 1, dateString[2]);
            }
            return null;
        },
        convertDateTimeFromServer: function(date) {
            if (date) {
              return new Date(date);
            } else {
              return null;
            }
        }
    };
};


var SchemaOrgJobPosting = function() {

    var JOB_POSTING_ELEMENT = '[itemtype="http://schema.org/JobPosting"]';

    var dateUtils = new DateUtils();

    var getJobPosting = function() {
        return $(JOB_POSTING_ELEMENT);
    };

    var getName = function() {
        return getJobPosting().find('[itemprop="title"]').first().text().trim();
    };

    var getCompany = function() {
        return $('[itemtype="http://schema.org/Organization"]').find('[itemprop="name"]').first().text().trim() ||
            getJobPosting().find('[itemprop="hiringOrganization"]').first().text().trim();

    };

    var getLocation = function() {
        return $('[itemtype="http://schema.org/PostalAddress"]').first().text().trim() || $('[itemprop="jobLocation"]').first().text().trim();
    };

    var getHref = function() {
        return window.location.href;
    };

    return {
        hasPosition: function() {
            return Boolean($(JOB_POSTING_ELEMENT)[0]);
        },
        grabPosition: function() {
            var date = dateUtils.convertLocaleDateToServer(new Date()).toISOString();
            var position = {
                name: getName(),
                company: getCompany(),
                location: getLocation(),
                link: getHref(),
                created: date,
                edited: date,
                state: 'Created'
            };
            return position;
        },
        getHref: function() {
            return getHref();
        }
    };
};

var parser = new SchemaOrgJobPosting();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse(parser[request.method]());
    });