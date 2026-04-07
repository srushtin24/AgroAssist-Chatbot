// const API_URL = "http://127.0.0.1:8000/api/chat";

// // ── Session ID ────────────────────────────────────────────────
// function getSessionId() {
//   let id = sessionStorage.getItem("agro_session_id");
//   if (!id) {
//     id = "sess_" + Math.random().toString(36).substr(2, 9)
//              + "_" + Date.now();
//     sessionStorage.setItem("agro_session_id", id);
//   }
//   return id;
// }

// // ── Toggle chat window ────────────────────────────────────────
// function toggleChat() {
//   const win      = document.getElementById("chat-window");
//   const iconOpen = document.getElementById("bubble-icon-open");
//   const iconClose= document.getElementById("bubble-icon-close");
//   const isOpen   = win.classList.toggle("open");

//   iconOpen.style.display  = isOpen ? "none"  : "block";
//   iconClose.style.display = isOpen ? "block" : "none";

//   if (isOpen) {
//     document.getElementById("chat-input").focus();
//   }
// }

// // ── Append a message bubble ───────────────────────────────────
// function appendMessage(text, role, sources) {
//   const container = document.getElementById("chat-messages");

//   const div = document.createElement("div");
//   div.className = "msg " + (role === "user" ? "user-msg" : "bot-msg");
//   div.innerText = text;

//   if (sources && sources.length > 0) {
//     const tag = document.createElement("div");
//     tag.className = "source-tag";
//     tag.innerText = "Source: " + sources.join(", ");
//     div.appendChild(tag);
//   }

//   container.appendChild(div);
//   container.scrollTop = container.scrollHeight;
// }

// // ── Typing indicator ──────────────────────────────────────────
// function showTyping() {
//   const container = document.getElementById("chat-messages");
//   const div = document.createElement("div");
//   div.className = "msg typing-msg";
//   div.id = "typing-indicator";

//   // animated dots
//   div.innerHTML = "Thinking<span id='dots'>.</span>";
//   container.appendChild(div);
//   container.scrollTop = container.scrollHeight;

//   // animate dots
//   let count = 1;
//   window._typingTimer = setInterval(() => {
//     count = (count % 3) + 1;
//     const dots = document.getElementById("dots");
//     if (dots) dots.innerText = ".".repeat(count);
//   }, 400);
// }

// function hideTyping() {
//   clearInterval(window._typingTimer);
//   const el = document.getElementById("typing-indicator");
//   if (el) el.remove();
// }

// // ── Send message ──────────────────────────────────────────────
// async function sendMessage() {
//   const input   = document.getElementById("chat-input");
//   const sendBtn = document.getElementById("chat-send-btn");
//   const text    = input.value.trim();

//   if (!text) return;

//   appendMessage(text, "user");
//   input.value   = "";
//   input.disabled   = true;
//   sendBtn.disabled = true;
//   showTyping();

//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         session_id: getSessionId(),
//         message: text
//       })
//     });

//     if (!response.ok) {
//       throw new Error("Server returned " + response.status);
//     }

//     const data = await response.json();
//     hideTyping();
//     appendMessage(data.reply, "bot", data.sources);

//   } catch (err) {
//     hideTyping();
//     appendMessage(
//       "Sorry, could not connect to the server. Make sure the backend is running.",
//       "bot"
//     );
//     console.error("Chat error:", err);
//   } finally {
//     input.disabled   = false;
//     sendBtn.disabled = false;
//     input.focus();
//   }
// }





const API_URL = "http://127.0.0.1:8000/api/chat";

// ── Voice settings ────────────────────────────────────────────
const VOICE_OUTPUT_ENABLED = true;   // set false to disable bot speaking
const VOICE_LANG = "en-IN";          // Indian English — change to "hi-IN" for Hindi

// ── Session ID ────────────────────────────────────────────────
function getSessionId() {
  let id = sessionStorage.getItem("agro_session_id");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substr(2, 9)
             + "_" + Date.now();
    sessionStorage.setItem("agro_session_id", id);
  }
  return id;
}

// Toggle chat window 
function toggleChat() {
  const win       = document.getElementById("chat-window");
  const iconOpen  = document.getElementById("bubble-icon-open");
  const iconClose = document.getElementById("bubble-icon-close");
  const isOpen    = win.classList.toggle("open");

  iconOpen.style.display  = isOpen ? "none"  : "block";
  iconClose.style.display = isOpen ? "block" : "none";

  if (isOpen) document.getElementById("chat-input").focus();
}

// Append message bubble
function appendMessage(text, role, sources) {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user-msg" : "bot-msg");
  div.innerText = text;

  if (sources && sources.length > 0) {
    const tag = document.createElement("div");
    tag.className = "source-tag";
    tag.innerText = "Source: " + sources.join(", ");
    div.appendChild(tag);
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Typing indicator
function showTyping() {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "msg typing-msg";
  div.id = "typing-indicator";
  div.innerHTML = "Thinking<span id='dots'>.</span>";
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  let count = 1;
  window._typingTimer = setInterval(() => {
    count = (count % 3) + 1;
    const dots = document.getElementById("dots");
    if (dots) dots.innerText = ".".repeat(count);
  }, 400);
}

function hideTyping() {
  clearInterval(window._typingTimer);
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// Voice OUTPUT — bot speaks the reply
function speakText(text) {
  if (!VOICE_OUTPUT_ENABLED) return;
  if (!window.speechSynthesis) return;

  // stop any currently speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = VOICE_LANG;
  utterance.rate  = 0.95;   // slightly slower than default
  utterance.pitch = 1.0;

  // pick an Indian English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang === "en-IN" || v.lang === "hi-IN" || v.name.includes("India")
  );
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

// Voice INPUT — mic to text
let recognition = null;
let isListening = false;

function toggleVoiceInput() {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.lang           = VOICE_LANG;
  recognition.interimResults = true;   // show partial results while speaking
  recognition.continuous     = false;  // stop after one sentence

  const micBtn = document.getElementById("chat-mic-btn");
  const input  = document.getElementById("chat-input");

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add("listening");
    input.placeholder = "Listening... speak now";
  };

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    input.value = transcript;  // show what was heard in the input box
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove("listening");
    input.placeholder = "Ask about plants or tap mic...";

    // auto send if something was captured
    if (input.value.trim()) {
      sendMessage();
    }
  };

  recognition.onerror = (event) => {
    isListening = false;
    micBtn.classList.remove("listening");
    input.placeholder = "Ask about plants or tap mic...";

    if (event.error === "not-allowed") {
      alert("Microphone permission denied. Please allow mic access in your browser.");
    } else if (event.error !== "no-speech") {
      alert("Voice error: " + event.error);
    }
  };

  recognition.start();
}

// Send message
async function sendMessage() {
  const input   = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");
  const text    = input.value.trim();

  if (!text) return;

  // stop any ongoing speech when user sends new message
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  appendMessage(text, "user");
  input.value      = "";
  input.disabled   = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        message: text
      })
    });

    if (!response.ok) throw new Error("Server returned " + response.status);

    const data = await response.json();
    hideTyping();
    appendMessage(data.reply, "bot", data.sources);

    // speak the bot reply
    speakText(data.reply);

  } catch (err) {
    hideTyping();
    appendMessage(
      "Sorry, could not connect to the server. Make sure the backend is running.",
      "bot"
    );
    console.error("Chat error:", err);
  } finally {
    input.disabled   = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// preload voices (Chrome needs this)
window.speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};