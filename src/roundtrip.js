import fs from "node:fs";
import { runTextToSpeech } from "./tts.js";
import { client } from "./client.js";

/**
 * The "did this actually work" test: generate audio with TTS, then send it
 * straight back through Speech-to-Text. The transcript should roughly match
 * what we asked TTS to say.
 */
export async function runRoundTrip() {
  console.log("\n  Step 1/2 — Text to Speech\n");
  const mp3Path = await runTextToSpeech();

  console.log("  Step 2/2 — Transcribing the file we just made...\n");

  const audioBlob = new Blob([fs.readFileSync(mp3Path)], { type: "audio/mp3" });

  const transcript = await client.speechToText.convert({
    file: audioBlob,
    modelId: "scribe_v1",
  });

  console.log("  Transcript:");
  console.log(`  > ${transcript.text}\n`);

  if (transcript.languageCode) {
    console.log(
      `  Detected language: ${transcript.languageCode} (confidence ${(
        (transcript.languageProbability ?? 0) * 100
      ).toFixed(1)}%)\n`
    );
  }
}
