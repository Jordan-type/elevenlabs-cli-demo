import { input } from "@inquirer/prompts";
import { client, saveAudioStream, timestamp } from "./client.js";

/**
 * Free-tier accounts can't call library voices via the API, so instead of
 * hardcoding a voice ID, ask the API which "default" voices the current
 * account has and use the first one. Cached after the first call.
 */
let cachedDefaultVoiceId = null;

async function getDefaultVoiceId() {
  if (cachedDefaultVoiceId) return cachedDefaultVoiceId;

  const result = await client.voices.search({
    voiceType: "default",
    pageSize: 1,
  });
  const voice = result.voices?.[0];
  if (!voice) {
    throw new Error(
      "No default voices found on this account. " +
        "Open the ElevenLabs dashboard and add a default voice to 'My Voices'."
    );
  }
  cachedDefaultVoiceId = voice.voiceId;
  return cachedDefaultVoiceId;
}

export async function runTextToSpeech(voiceId) {
  const text = await input({
    message: "What should I say?",
    default: "Hello from the ElevenLabs API. This is a demo.",
  });

  const voice = voiceId ?? (await getDefaultVoiceId());

  console.log("  Generating audio...");
  const audio = await client.textToSpeech.convert(voice, {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
  });

  const filepath = await saveAudioStream(audio, `tts-${timestamp()}.mp3`);
  console.log(`  Saved: ${filepath}\n`);
  return filepath;
}
