import { select } from "@inquirer/prompts";
import { client } from "./client.js";
import { runTextToSpeech } from "./tts.js";

export async function runVoicePicker() {
  console.log("  Fetching voices...");
  const result = await client.voices.search({ pageSize: 20 });
  const voices = result.voices ?? [];

  if (voices.length === 0) {
    console.log("  No voices returned for this account.\n");
    return;
  }

  const voiceId = await select({
    message: `Pick a voice (${voices.length} available)`,
    choices: voices.map((v) => ({
      name: `${v.name}${v.labels?.accent ? ` — ${v.labels.accent}` : ""}${
        v.labels?.description ? ` (${v.labels.description})` : ""
      }`,
      value: v.voiceId,
    })),
  });

  await runTextToSpeech(voiceId);
}
