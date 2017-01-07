/*global chrome*/

// This creates and maintains the communication channel between the inspectedPage and the dev tools panel.
//
// In this example, messages are JSON objects
// {
//   action: ["code"|"script"|"message"], // What action to perform on the inspected page
//   content: [String|Path to script|Object], // data to be passed through
//   tabId: [Automatically added]
// }

// This sends an object to the background page where it can be relayed to the inspected page
var sendObjectToInspectedPage = function(message) {
  message.tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.extension.sendMessage(message);
};

//Create a port with background page for continous message communication
var port = chrome.extension.connect({
  name: "Meiosis-Tracer Channel"
});

var tracer = null;
var receive = null;

// Listen to messages from the background page
port.onMessage.addListener(function(evt) {
  var data = JSON.parse(evt).message.data;
  var model = data.model;
  var proposal = data.proposal;

  if (data.type === "MEIOSIS_VALUES") {
    // To re-render the view, send a message.
    var render = function(model) {
      sendObjectToInspectedPage({ content: { type: "MEIOSIS_RENDER_MODEL", model: model } });
    };

    tracer = window.meiosisTracer({ selector: "#meiosis-tracer", render: render, initialModel: model, horizontal: true });
    receive = tracer.component.receive;
  }
  else if (data.type === "MEIOSIS_VALUES" && receive) {
    receive(model, proposal);
  }
});

chrome.devtools.network.onNavigated.addListener(function() {
  if (tracer) {
    tracer.reset();
  }
  sendObjectToInspectedPage({ content: { type: "MEIOSIS_TRACER_INIT" } });
});
sendObjectToInspectedPage({ content: { type: "MEIOSIS_TRACER_INIT" } });
