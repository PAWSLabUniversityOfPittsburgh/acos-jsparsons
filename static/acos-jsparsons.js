/* global ACOS, alert, $, parson */
/* exported initial, unittest, displayErrors, parsonsGrade */
/* jshint globalstrict: true */

"use strict";
var initial;
var unittest;

function displayErrors(feedback) { 
  if(feedback.length > 0) { 
    showDialog("Error", Array.isArray(feedback) ? feedback[0] : feedback);
  } 
}

function display_feedback(feedback, correct=True) { 
  if(feedback.length > 0) { 
    showDialog("Feedback", Array.isArray(feedback) ? feedback[0] : feedback);
  } 
}

function showDialog(title, message, callback, options) {
  var buttons = {};
  buttons[options?(options.buttonTitle || "OK"):"OK"] = function() {
    $(this).dialog( "close" );
  };
  var opts = $.extend(true,
                      { buttons: buttons,
                        modal: true,
                        title: title,
                        draggable: false,
                        close: function() {
                          // if there is a callback, call it
                          if ($.isFunction(callback)) {
                            callback();
                          }
                          return true;
                        }
                      },
                      options);
  $("#feedback-dialog") // find the dialog element
        .find("p") // find the p element inside
            .text(message) // set the feedback text
        .end() // go back to the #feedbackDialog element
        .dialog(opts);
};

function parsonsGrade(feedback) {
  // For acos-jsparsons-gamey-pseudo contentPackage:
  if( $("#gamified-parsons").val() === "true" ) {
    parson.user_actions.push({gamified:true});
  }
    parson.user_actions.push( { problemName: $("#js-parsons-id").val() } );
  //feedback.length for line-based graders and feedback.success for unit test graders
  if(feedback.length === 0 || feedback.success === true) {
    ACOS.sendEvent('grade', {'points': 1, 'max_points': 1, 'status': 'graded', 'feedback': 'Problem solved successfully.'}); 
    ACOS.sendEvent('log', {log:parson.user_actions, problemName: $("#js-parsons-id").val()});
  } else {
    ACOS.sendEvent('grade', {'points': 0, 'max_points': 1, 'status': 'graded', 'feedback': feedback[0]});
    ACOS.sendEvent('log', {log:parson.user_actions, problemName: $("#js-parsons-id").val()});
  } 
}

function resizePostMessage() {
  parent.postMessage({ 
    messageType: "resize", 
    iframeHeight: document.body.scrollHeight,  
    iframeUrl: window.location.href 
  }, "*");
}
