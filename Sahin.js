let savedBodyHTML = null;

(function () {
  "use strict";

  let savedBodyHTML = null;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const Sahin = {
    load: function () {
      console.log("Sahin loadded:");
    },

    scrollToBottom: function () {
      J$("html, body").scrollTop(J$(document).height());
    },

    clickevery: function (buttonText, intervalTime) {
      var intervalId = setInterval(function () {
        // Find the button with the specified text (case-insensitive)
        var button = J$("button").filter(function () {
          return J$(this)
            .text()
            .toLowerCase()
            .includes(buttonText.toLowerCase());
        });

        // Check if the button is found
        if (button.length > 0) {
          // Simulate a click event on the button
          button.click();
        } else {
          console.log("Button with text '" + buttonText + "' not found.");
          clearInterval(intervalId); // Stop the interval
        }
      }, intervalTime);
    },

    downloadAsJson: function (data) {
      var json = JSON.stringify(data, null, 2);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "data.json";
      link.click();
      URL.revokeObjectURL(url);
    },

    waitForText(text) {
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
    },

    windowSave() {
      savedBodyHTML = document.body.innerHTML;
    },

    async windowRestore(timeout) {
      if (savedBodyHTML !== null) {
        await sleep(timeout); // Delay for 4000 milliseconds
        document.body.innerHTML = savedBodyHTML;
      }
    },
  };

  window.Sahin = Sahin;
})();

Sahin.load();
