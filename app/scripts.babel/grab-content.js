/* global $, chrome */
'use strict';


var SchemaOrgJobPosting = function() {

    var JOB_POSTING_ELEMENT = '[itemtype="http://schema.org/JobPosting"]';

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
            var position = {
                name: getName(),
                company: getCompany(),
                location: getLocation(),
                link: getHref()
            };
            return position;
        }
    };
};

var parser = new SchemaOrgJobPosting();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse(parser[request.method]());
    });