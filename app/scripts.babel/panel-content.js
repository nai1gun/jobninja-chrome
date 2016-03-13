/* global $, chrome */
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

    var removePanel = function() {
        $('#' + IFRAME_ID).remove();
    };

    var injectIframe = function(html) {
        if (!panelExists()) {
            html.append(
              '<iframe id="' + IFRAME_ID + '" scrolling="no" frameborder="0"></iframe>'
            );
        }
    };

    var appendCssFile = function(filePath) {
       $('#' + IFRAME_ID).contents().find('head').append(
            '<link  type="text/css" rel="stylesheet" href="' +
                chrome.extension.getURL(filePath) + '"/>');
    };

    var injectStyles = function() {
        $('#job-ninja-panel-wrapper').contents().find('head, body')
            .css('height', 'auto')
            .css('width', 'auto')
            .css('z-index', 2147483647)
            .css('margin', 0);
        appendCssFile('bower_components/bootstrap/dist/css/bootstrap.min.css');
        appendCssFile('styles/panel.css');
    };

    var injectHtml = function(callback) {
        $('#' + IFRAME_ID).contents().find('body').load(chrome.extension.getURL('panel.html'), callback);
    };

    var adjustIframeSize = function() {
        var iFrame = $('#' + IFRAME_ID);
        var iFrameBody = iFrame.contents().find('body')[0];
        var newHeight = iFrameBody.scrollHeight;
        var newWidth = iFrameBody.scrollWidth;
        iFrame.height(newHeight + 'px');
        iFrame.width(newWidth + 'px');
    };

    var addEventLiteners = function() {
        $(function() {
            $('#' + IFRAME_ID).contents().find('#job-ninja-panel-submit').click(function() {
                chrome.runtime.sendMessage({context: 'background', component: 'background', method: 'openPopup'});
                removePanel();
            });
        });
    };

    return {
        createSidePanel: function() {
            injectIframe(getHtmlElement());
            injectStyles();
            injectHtml(function() {
                adjustIframeSize();
                addEventLiteners();
            });
        },
        panelExists: panelExists,
        removePanel: removePanel
    };

};