/* global chrome */
'use strict';

var ApplicationContext = function() {

    var components = {
        parser: new window.SchemaOrgJobPosting(),
        panel: new window.SidePanel()
    };

    return {
        invoke: function(componentName, methodName) {
            var component = components[componentName];
            if (component) {
                var method = component[methodName];
                if (method) {
                    return method();
                } else {
                    throw 'No method "' + methodName + '" in component "' + componentName + '"';
                }
            } else {
                throw 'No component with name: ' + componentName;
            }
        }
    };
};

var context = new ApplicationContext();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.context === 'content') {
            sendResponse(context.invoke(request.component, request.method));
        }
    });