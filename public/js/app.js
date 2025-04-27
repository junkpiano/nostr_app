import { nip19 } from "https://esm.sh/nostr-tools";
import { fetchProfile, renderProfile } from "./profile.js";
import { loadEvents } from "./events.js";

const output = document.getElementById("nostr-output");
const profileSection = document.getElementById("profile-section");
const loadMoreBtn = document.getElementById("load-more");
const connectingMsg = document.getElementById("connecting-msg");
const relays = ["wss://nos.lol", "wss://relay.nostr.band", "wss://relay.damus.io"];
const limit = 100;
let seenEventIds = new Set();
let untilTimestamp = Math.floor(Date.now() / 1000);
let profile = null;

// Parse npub from URL
const path = window.location.pathname;
const npub = path.replace("/", "").trim();

document.addEventListener("DOMContentLoaded", () => {
  if (connectingMsg) {
    connectingMsg.style.display = "none"; // Hide connecting message by default
  }
});

if (npub === "") {
  showInputForm();
} else if (npub.startsWith("npub")) {
  startApp(npub);
} else {
  output.innerHTML = "<p class='text-red-500'>Invalid URL format. Please input a valid npub address.</p>";
}

async function startApp(npub) {
  let pubkeyHex;
  try {
    const decoded = nip19.decode(npub);
    pubkeyHex = decoded.data;
  } catch (e) {
    output.innerHTML = "<p class='text-red-500'>Failed to decode npub address.</p>";
    throw e;
  }

  profile = await fetchProfile(pubkeyHex, relays);
  renderProfile(pubkeyHex, npub, profile, profileSection);
  await loadEvents(pubkeyHex, profile, relays, limit, untilTimestamp, seenEventIds, output, connectingMsg);

  document.getElementById("posts-header").style.display = "";
}

function showInputForm() {
  document.getElementById("posts-header").style.display = "none";
  loadMoreBtn.style.display = "none";
  if (connectingMsg) connectingMsg.remove();

  profileSection.innerHTML = `
    <div class="flex flex-col items-center space-y-4">
      <h2 class="text-xl font-semibold">Enter a Nostr npub Address</h2>
      <input id="npub-input" type="text" placeholder="npub1..." 
        class="border border-gray-300 rounded px-4 py-2 w-full max-w-md text-gray-700" />
      <button id="go-button" class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
        Go
      </button>
    </div>
  `;

  document.getElementById("go-button").addEventListener("click", () => {
    const npub = document.getElementById("npub-input").value.trim();
    if (npub.startsWith("npub")) {
      window.location.href = `/${npub}`;
    } else {
      alert("Please enter a valid npub address!");
    }
  });
}