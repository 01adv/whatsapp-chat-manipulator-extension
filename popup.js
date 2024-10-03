// document.getElementById("startButton").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tabId = tabs[0].id;

//     // Inject the content script dynamically
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabId },
//         files: ["content.js"],
//       },
//       () => {
//         // After injecting, send the message to start the manipulation
//         chrome.tabs.sendMessage(tabId, { action: "start" });
//       }
//     );
//   });
// });

// document.getElementById("stopButton").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tabId = tabs[0].id;

//     // Inject the content script dynamically (in case it is not already injected)
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabId },
//         files: ["content.js"],
//       },
//       () => {
//         // After injecting, send the message to stop the manipulation
//         chrome.tabs.sendMessage(tabId, { action: "stop" });
//       }
//     );
//   });
// });

// document.getElementById("startButton").addEventListener("click", () => {
//   const targetLanguage = document.getElementById("languageSelect").value;
//   console.log("Target language: " + targetLanguage);

//   // Store the selected language in Chrome storage
//   chrome.storage.sync.set({ targetLanguage: targetLanguage }, function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const tabId = tabs[0].id;

//       // Inject the content script dynamically
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: tabId },
//           files: ["content.js"],
//         },
//         () => {
//           // After injecting, send the message to start the manipulation
//           chrome.tabs.sendMessage(tabId, { action: "start" });
//         }
//       );
//     });
//   });
// });

// document.getElementById("stopButton").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tabId = tabs[0].id;

//     // Inject the content script dynamically (in case it is not already injected)
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabId },
//         // files: ["content.js"],
//       },
//       () => {
//         // After injecting, send the message to stop the manipulation
//         chrome.tabs.sendMessage(tabId, { action: "stop" });
//       }
//     );
//   });
// });

document.getElementById("startButton").addEventListener("click", () => {
  const targetLanguage = document.getElementById("languageSelect").value;
  console.log("Target language: " + targetLanguage);

  // Store the selected language in Chrome storage
  chrome.storage.sync.set({ targetLanguage: targetLanguage }, function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Inject the content script dynamically
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["content.js"],
        },
        () => {
          // After injecting, send the message to start the manipulation
          chrome.tabs.sendMessage(tabId, { action: "start" });
        }
      );
    });
  });
});

// Handle the stop button
document.getElementById("stopButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        // files: ["content.js"],
      },
      () => {
        // Send the stop message to content.js
        chrome.tabs.sendMessage(tabId, { action: "stop" });
      }
    );
  });
});

// Listen for language change in the select dropdown and notify content.js
document.getElementById("languageSelect").addEventListener("change", () => {
  const targetLanguage = document.getElementById("languageSelect").value;
  console.log("Language changed to: " + targetLanguage);

  // Update the language in Chrome storage
  chrome.storage.sync.set({ targetLanguage: targetLanguage }, function () {
    // Send a message to content.js to update the language note
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { action: "updateLanguage" });
    });
  });
});
