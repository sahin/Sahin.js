
"use strict";

(function() {

  let savedBodyHTML = null;
  
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  const Sahin = {};
  window.Sahin = Sahin;
  Sahin.load = function () {
    console.log("Sahin loaded:");
  };
  Sahin.load();
  
  
  Sahin.clickByText = function (buttonText) {
    var button = J$("button").filter(function () {
      return J$(this)
        .text()
        .toLowerCase()
        .includes(buttonText.toLowerCase());
    });
  
    if (button.length > 0) {
      button.click();
    }
  };
  
  Sahin.clickEvery = function (buttonText, intervalTime) {
    var intervalId = setInterval(function () {
      var button = J$("button").filter(function () {
        return J$(this)
          .text()
          .toLowerCase()
          .includes(buttonText.toLowerCase());
      });
  
      if (button.length > 0) {
        button.click();
      } else {
        console.log("Button with text '" + buttonText + "' not found.");
      }
    }, intervalTime);
  };
  
  Sahin.convertArrayOfObjectsToCSV = function (args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  
    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }
  
    columnDelimiter = args.columnDelimiter || ",";
    lineDelimiter = args.lineDelimiter || "\n";
  
    keys = Object.keys(data[0]);
  
    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
  
    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;
  
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });
  
    return result;
  };
  
  Sahin.createObserver = function (textToLookFor, actionFunction) {
    var observerCallback = function (mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          var addedNodes = mutation.addedNodes;
          for (var node of addedNodes) {
            if (node.nodeType === 1 && node.textContent.includes(textToLookFor)) {
              actionFunction();
              observer.disconnect();
              return;
            }
          }
        }
      }
    };
    var observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });
  };
  
  Sahin.downloadAsJson = function (data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename || "data.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  
  Sahin.downloadCSV = function (args) {
    var data, filename;
    var csv = Sahin.convertArrayOfObjectsToCSV({
      data: args.data,
    });
    if (csv == null) return;
  
    filename = args.filename || "export.csv";
  
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
  
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  Sahin.formatNumberEUtoUS = function (number) {
    return number
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/TL/g, "")
      .trim();
  };
  
  Sahin.scrollToBottom = function () {
    J$("html, body").scrollTop(J$(document).height());
  };
  
  Sahin.simulateClick = function (element) {
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    element.dispatchEvent(evt);
  };
  
  Sahin.waitForText = async function (text) {
    return new Promise((resolve) => {
      function checkForText() {
        if (document.body.textContent.includes(text)) {
          J$(document).off("ajaxStop", checkForText);
          resolve();
        }
      }
  
      J$(document).on("ajaxStop", checkForText);
  
      checkForText();
      const interval = setInterval(checkForText, 100);
  
      resolve = ((origResolve) => {
        return () => {
          clearInterval(interval);
          origResolve();
        };
      })(resolve);
    });
  };
  
  Sahin.windowSave = function () {
    savedBodyHTML = document.body.innerHTML;
  };
  
  Sahin.windowRestore = async function (timeout) {
    if (savedBodyHTML !== null) {
      await sleep(timeout);
      document.body.innerHTML = savedBodyHTML;
    }
  };



})();
