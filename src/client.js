import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUTPUT_DIR = path.resolve(__dirname, "..", "output");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Save an async-iterable audio stream returned by the SDK to disk.
 * The SDK returns a ReadableStream of audio bytes; we collect chunks into a Buffer.
 */
export async function saveAudioStream(stream, filename) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, Buffer.concat(chunks));
  return filepath;
}

export function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}
