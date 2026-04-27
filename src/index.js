#!/usr/bin/env node
/**
 * ElevenLabs CLI Demo
 *
 * A small showcase of four ElevenLabs APIs from a single Node.js CLI:
 *   1. Text to Speech
 *   2. Voice listing / picker
 *   3. Sound Effects
 *   4. Speech to Text (round-trip on the audio we just generated)
 */

import "dotenv/config";
import { select } from "@inquirer/prompts";
import { runTextToSpeech } from "./tts.js";
import { runVoicePicker } from "./voices.js";
import { runSoundEffects } from "./sfx.js";
import { runRoundTrip } from "./roundtrip.js";

function assertApiKey() {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error(
      "\n  Missing ELEVENLABS_API_KEY.\n" +
        "  Copy .env.example to .env and paste your key.\n"
    );
    process.exit(1);
  }
}

async function main() {
  assertApiKey();

  console.log("\n  ElevenLabs CLI Demo\n  --------------------");

  const choice = await select({
    message: "What do you want to try?",
    choices: [
      { name: "1. Text to Speech (default voice)", value: "tts" },
      { name: "2. Browse voices and narrate with one", value: "voices" },
      { name: "3. Generate a sound effect from a prompt", value: "sfx" },
      { name: "4. Round trip: TTS -> Speech to Text", value: "roundtrip" },
      { name: "Exit", value: "exit" },
    ],
  });

  switch (choice) {
    case "tts":
      await runTextToSpeech();
      break;
    case "voices":
      await runVoicePicker();
      break;
    case "sfx":
      await runSoundEffects();
      break;
    case "roundtrip":
      await runRoundTrip();
      break;
    case "exit":
    default:
      console.log("\n  Bye.\n");
      return;
  }
}

main().catch((err) => {
  // Inquirer throws this when the user hits Ctrl+C at a prompt; exit cleanly.
  if (err?.name === "ExitPromptError") {
    console.log("\n  Cancelled.\n");
    process.exit(0);
  }
  console.error("\n  Error:", err.message ?? err, "\n");
  process.exit(1);
});
