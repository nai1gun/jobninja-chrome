/* global $, chrome */
'use strict';
var SidePanel = function() {

    var IFRAME_ID = 'job-ninja-panel-wrapper';

    var PANEL_WIDTH = '150px';

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
              '<iframe id="' + IFRAME_ID + '" scrolling="no" frameborder="0" ' +
                'style="position: fixed; width: ' + PANEL_WIDTH + '; border:none; z-index: 2147483647; top: 0px;' +
                       'height: 100%; right: 0px;">' +
              '</iframe>'
            );
        }
    };

    var injectStyle = function() {
        document.getElementById(IFRAME_ID).contentDocument.body.innerHTML =
          '<style type="text/css">       \
            html, body {                 \
              height: 100%;              \
              width: 100%;               \
              z-index: 2147483647;       \
              margin: 0;                 \
            }                            \
          </style>';
    };

    var injectHtml = function() {
        document.getElementById(IFRAME_ID).contentDocument.body.innerHTML +=
            '<div style="background-color: white; width: 100%; height: 100%; float: right;">' +
                'Dummy content!<br><br><br><br><br><br><br><br><br><br><br><br>end</div>';
    };

    return {
        createSidePanel: function() {
            injectIframe(getHtmlElement());
            injectStyle();
            injectHtml();
        },
        panelExists: panelExists,
        removePanel: function() {
            $('#' + IFRAME_ID).remove();
        }
    };

};

var panel = new SidePanel();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (panel[request.method]) {
            sendResponse(panel[request.method]());
        }
    });