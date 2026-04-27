import { input } from "@inquirer/prompts";
import { client, saveAudioStream, timestamp } from "./client.js";

export async function runSoundEffects() {
  const text = await input({
    message: "Describe the sound effect",
    default: "A vintage typewriter clacking, paper rustling, finished with a bell ding",
  });

  console.log("  Generating sound effect...");
  const audio = await client.textToSoundEffects.convert({
    text,
    durationSeconds: 5,
  });

  const filepath = await saveAudioStream(audio, `sfx-${timestamp()}.mp3`);
  console.log(`  Saved: ${filepath}\n`);
  return filepath;
}
