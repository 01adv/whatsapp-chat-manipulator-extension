let observer; // To hold the mutation observer globally
let chatObserver; // To monitor chat switch globally

// Function to modify chats (reversing text and injecting modified message)
function modifyChats() {
  const messageBlocks = document.querySelectorAll(".message-in");

  messageBlocks.forEach((messageBlock) => {
    const messageSpans = messageBlock.querySelectorAll(".selectable-text span");

    let combinedMessage = "";
    messageSpans.forEach((msgSpan) => {
      combinedMessage += msgSpan.textContent;
    });

    const reversedText = combinedMessage.split("").reverse().join("");

    // Retrieve the target language from Chrome storage
    chrome.storage.sync.get("targetLanguage", (data) => {
      const targetLanguage = data.targetLanguage;

      if (targetLanguage) {
        let noteText = "";
        // Determine the note based on the target language
        if (targetLanguage === "es") {
          noteText = "Translated to Spanish: ";
        } else if (targetLanguage === "fr") {
          noteText = "Translated to French: ";
        } else if (targetLanguage === "de") {
          noteText = "Translated to German: ";
        } else if (targetLanguage === "hi") {
          noteText = "Translated to Hindi: ";
        } // Add more languages as needed

        // Find existing notes and update them if necessary
        const existingNote = messageBlock.querySelector(".language-note");
        if (existingNote) {
          existingNote.textContent = noteText + reversedText; // Update the text of the existing note
        } else {
          // Add a new note if one doesn't already exist
          const noteDiv = document.createElement("div");
          noteDiv.textContent = noteText + reversedText; // Add the note with the reversed text
          noteDiv.className = "language-note"; // Class to mark the injected note div
          noteDiv.style.color = "#007BFF"; // Note color
          noteDiv.style.backgroundColor = "#E7F3FF"; // Note background
          noteDiv.style.padding = "5px";
          noteDiv.style.borderRadius = "5px";
          noteDiv.style.marginTop = "5px";

          messageBlock.appendChild(noteDiv);
        }
      }
    });
  });
}

// Function to observe the chat container and modify messages
function observeChat() {
  const chatContainer = document.querySelector("#main .copyable-area");

  if (chatContainer) {
    // If an existing observer is already active, disconnect it first
    if (observer) {
      observer.disconnect();
    }

    // MutationObserver to detect new messages being added in the chat
    observer = new MutationObserver(() => {
      modifyChats(); // Modify all visible chat messages when something new is added
    });

    // Start observing the chat container for added/removed nodes
    observer.observe(chatContainer, { childList: true, subtree: true });

    // Run the modify function immediately for existing messages
    modifyChats();
  }
}

// Function to detect when user switches to a new chat
function observeChatSwitch() {
  const appElement = document.querySelector("#app");

  if (appElement) {
    // Observe when new chats are loaded
    chatObserver = new MutationObserver(() => {
      observeChat(); // Re-observe the chat container for the new chat
    });

    // Observe the main app container for child node changes (chat switch)
    chatObserver.observe(appElement, { childList: true, subtree: true });
  }
}

// Function to start modifying chats and detect chat switching
function startModifyingChats() {
  observeChat(); // Start observing the current chat
  observeChatSwitch(); // Keep watching for chat switches
}

// Function to stop modifying chats
function stopModifyingChats() {
  if (observer) {
    observer.disconnect(); // Stop the MutationObserver for the chat container
  }

  if (chatObserver) {
    chatObserver.disconnect(); // Stop observing chat switches
  }
}

// Listen for messages from popup.js (start/stop/update actions)
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "stop") {
    stopModifyingChats(); // Stop modifying chats
    console.log("Manipulation stopped.");
  } else if (request.action === "start") {
    startModifyingChats(); // Start modifying chats
    console.log("Manipulation started.");
  } else if (request.action === "updateLanguage") {
    modifyChats(); // Re-run chat modification to update language note
    console.log("Language updated, chat reprocessed.");
  }
});
