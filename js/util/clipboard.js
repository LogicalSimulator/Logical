// https://stackoverflow.com/a/30810322/10291933

const alert_on_copy = false;
const alert_on_paste = false;

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
    if (successful) {
      if (alert_on_copy) {
        alert("Successfully copied!");
      }
    } else {
      if (alert_on_copy) {
        alert("Unable to copy!");
      }
    }
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    if (alert_on_copy) {
      alert("Unable to copy!");
    }
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text, success, fail) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => {
      if (success != undefined) {
        success();
      }
      if (alert_on_copy) {
        alert("Successfully copied!");
      }
    },
    (err) => {
      console.error("Async: Could not copy text: ", err);
      if (fail != undefined) {
        fail();
      }
      if (alert_on_copy) {
        alert("Unable to copy!");
      }
    }
  );
}

function readTextFromClipboard(callback, fail_calback) {
  navigator.clipboard
    .readText()
    .then((text) => {
      console.log("Pasted content: ", text);
      callback(text);
      if (alert_on_paste) {
        alert("Successfully pasted!");
      }
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
      if (fail_calback != undefined) {
        fail_calback();
      }
      if (alert_on_paste) {
        alert("Unable to paste!");
      }
    });
}
