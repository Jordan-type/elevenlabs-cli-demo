import { input } from "@inquirer/prompts";
import { client, saveAudioStream, timestamp } from "./client.js";

// "Rachel" — a default ElevenLabs voice present on every account.
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export async function runTextToSpeech(voiceId = DEFAULT_VOICE_ID) {
  const text = await input({
    message: "What should I say?",
    default: "Hello from the ElevenLabs API. This is a demo.",
  });

  console.log("  Generating audio...");
  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
  });

  const filepath = await saveAudioStream(audio, `tts-${timestamp()}.mp3`);
  console.log(`  Saved: ${filepath}\n`);
  return filepath;
}
