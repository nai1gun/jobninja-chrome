/* global $ */
'use strict';
$(function() {
    var jobPosting = $('[itemtype="http://schema.org/JobPosting"]')[0];
    console.log(jobPosting);
    if (jobPosting) {
        console.log('Found job posting on the page :)');
    } else {
        console.log('Job posting content not found :(');
    }
});