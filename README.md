# ElevenLabs CLI Demo

A small Node.js CLI that walks through four ElevenLabs APIs from a single menu:

1. **Text to Speech** — generate an MP3 from any text with the default voice.
2. **Voices** — list voices on your account, pick one, and narrate with it.
3. **Sound Effects** — generate a 5-second sound effect from a text prompt.
4. **Round trip** — generate speech with TTS, then send the resulting file
   back through Speech-to-Text and print the transcript. A nice end-to-end
   sanity check that everything works.

All output lands in `./output/` as `.mp3` files.

## Quick start

```bash
git clone <this-repo>
cd elevenlabs-cli-demo

npm install

cp .env.example .env
# paste your key into .env

npm start
```

Pick an option from the menu and follow the prompts.

## API key permissions

This demo only needs:

- `Text to Speech: Access`
- `Voices: Read`
- `Sound Effects: Access`
- `Speech to Text: Access`

Everything else can stay on `No Access`. Setting a small monthly credit limit
on the key is a good habit — it caps the blast radius if the key ever leaks.

## Free tier note

ElevenLabs blocks library voices over the API on the free plan. To stay
free-tier-friendly, the demo asks the API for **default** voices only —
these are available to every account regardless of plan. If you upgrade
later and want access to the full voice library in the picker, drop the
`voiceType: "default"` filter in `src/voices.js`.

## Project layout

```
src/
  index.js       # CLI entry point and menu
  client.js      # Shared SDK client + helpers (audio stream -> file)
  tts.js         # Feature 1: Text to Speech
  voices.js      # Feature 2: Voice listing + picker (calls into tts.js)
  sfx.js         # Feature 3: Sound Effects
  roundtrip.js   # Feature 4: TTS -> Speech-to-Text round trip
output/          # Generated audio lands here
```

## Why this is structured the way it is

The four features map to four files. `client.js` is the only place the SDK
gets configured, so swapping models or output formats is a one-line change.
The voice picker reuses the TTS function with a different `voiceId` rather
than duplicating the call — same idea for the round trip, which calls TTS
and then feeds the resulting file straight into the Speech-to-Text endpoint.

## License

MIT
