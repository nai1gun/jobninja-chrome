/* global $ */
'use strict';
var SidePanel = function() {

    var IFRAME_ID = 'job-ninja-panel-wrapper';

    var getHtmlElement = function() {
        var html;
        if (document.documentElement) {
            html = $(document.documentElement);
        } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
            html = $(document.getElementsByTagName('html')[0]);
        } else if ($('html').length > -1) {
            html = $('html');
        } else {
            throw 'No html tag retrieved.';
        }
        return html;
    };

    var panelExists = function() {
        return document.getElementById(IFRAME_ID) != null;
    };

    var injectIframe = function(html) {
        if (!panelExists()) {
            html.append(
              '<iframe id="' + IFRAME_ID + '" scrolling="no" frameborder="0"></iframe>'
            );
        }
    };

    var injectStyles = function() {
        $('#job-ninja-panel-wrapper').contents().find('head, body')
            .css('height', 'auto')
            .css('width', 'auto')
            .css('z-index', 2147483647)
            .css('margin', 0);
        $('#' + IFRAME_ID).contents().find('head').append(
            '<link  type="text/css" rel="stylesheet" href="' +
                chrome.extension.getURL('styles/panel.css') + '"/>');
    };

    var injectHtml = function() {
        $('#' + IFRAME_ID).contents().find('body').append(
            '<div class="job-ninja-panel-component">' +
                'Dummy content!<br><br><br><br><br><br><br><br><br><br><br><br>end</div>');
    };

    var adjustIframeSize = function() {
        var iFrame = $('#' + IFRAME_ID);
        var iFrameBody = iFrame.contents().find('body')[0];
        var newHeight = iFrameBody.scrollHeight;
        var newWidth = iFrameBody.scrollWidth;
        iFrame.height(newHeight + 'px');
        iFrame.width(newWidth + 'px');
    };

    return {
        createSidePanel: function() {
            injectIframe(getHtmlElement());
            injectStyles();
            injectHtml();
            adjustIframeSize();
        },
        panelExists: panelExists,
        removePanel: function() {
            $('#' + IFRAME_ID).remove();
        }
    };

};