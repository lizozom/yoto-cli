import { Command } from "commander";
import {
  addTrackSmart,
  updateTrack,
  deleteTrack,
  uploadAudio,
  getTranscodeStatus,
} from "../commands/content.ts";

export function registerTrackCommands(program: Command): void {
  const track = program
    .command("track")
    .description("Manage playlist tracks");

  track
    .command("add <cardId> <chapterIdx> <title> <source>")
    .description("Add a new track to a chapter")
    .option("--icon <icon>", "Set track icon (file path, mediaId, or yoto:#mediaId)")
    .option("--duration <seconds>", "Set track duration in seconds (auto-detected for uploads)")
    .addHelpText(
      "after",
      `
Arguments:
  cardId       The playlist card ID
  chapterIdx   Chapter index (0-based)
  title        The track title
  source       File path, URL, or yoto:# hash

The source can be:
  - A local file path (e.g., ./song.mp3) - auto-uploads
  - A yoto:# hash (e.g., yoto:#abc123) - uses existing audio
  - An https:// URL - uses external audio

The --icon option accepts a file path (auto-uploads) or existing mediaId.

Examples:
  $ yoto track add 5ukMR 0 "My Song" ./song.mp3
  $ yoto track add 5ukMR 0 "Track 1" "yoto:#abc123def456"
  $ yoto track add 5ukMR 0 "Song" ./song.mp3 --icon ./cover.png
`
    )
    .action((cardId, chapterIdx, title, source, options) =>
      addTrackSmart(cardId, parseInt(chapterIdx, 10), title, source, {
        icon: options.icon,
        duration: options.duration ? parseInt(options.duration, 10) : undefined,
      })
    );

  track
    .command("edit <cardId> <chapterIdx> <trackIdx>")
    .description("Update a track's properties (title, icon, URL, playback behavior)")
    .option("--title <title>", "Update track title")
    .option("--icon <icon>", "Update track icon (file path, mediaId, or yoto:#mediaId)")
    .option("--url <url>", "Update track URL")
    .option("--on-end <action>", "Action when track ends: none (continue), stop (pause), repeat (loop)")
    .addHelpText(
      "after",
      `
Arguments:
  cardId       The playlist card ID
  chapterIdx   Chapter index (0-based)
  trackIdx     Track index within chapter (0-based)

The --icon option accepts a file path (auto-uploads) or existing mediaId.

Examples:
  $ yoto track edit 5ukMR 0 0 --title "New Title"
  $ yoto track edit 5ukMR 0 0 --icon ./cover.png
  $ yoto track edit 5ukMR 0 0 --on-end repeat
`
    )
    .action((cardId, chapterIdx, trackIdx, options) =>
      updateTrack(cardId, parseInt(chapterIdx, 10), parseInt(trackIdx, 10), {
        title: options.title,
        icon: options.icon,
        url: options.url,
        onEnd: options.onEnd,
      })
    );

  track
    .command("delete <cardId> <chapterIdx> <trackIdx>")
    .description("Delete a track from a chapter")
    .addHelpText(
      "after",
      `
Arguments:
  cardId       The playlist card ID
  chapterIdx   Chapter index (0-based)
  trackIdx     Track index within chapter (0-based)

Examples:
  $ yoto track delete 5ukMR 0 1
`
    )
    .action((cardId, chapterIdx, trackIdx) =>
      deleteTrack(cardId, parseInt(chapterIdx, 10), parseInt(trackIdx, 10))
    );

  track
    .command("upload <file>")
    .description("Upload an audio file and get a track URL (yoto:# hash)")
    .option("--json", "Output as JSON")
    .option("--no-wait", "Don't wait for transcoding to complete")
    .addHelpText(
      "after",
      `
Arguments:
  file    Path to audio file (MP3, M4A, FLAC, WAV, etc.)

Uploads an audio file to Yoto's servers. The file is transcoded to AAC format.
Returns a track URL (yoto:#hash) that can be used with track add.

By default, waits for transcoding to complete. Use --no-wait to return
immediately and check status later with 'track status'.

Supported formats: MP3, M4A, AAC, FLAC, WAV, OGG, and more.
Max file size: 1GB

Examples:
  $ yoto track upload ./song.mp3
  $ yoto track upload ./audiobook-chapter1.m4a --json
  $ yoto track upload ./large-file.mp3 --no-wait
`
    )
    .action((file, options) => uploadAudio(file, { json: options.json, wait: options.wait }));

  track
    .command("status <uploadId>")
    .description("Check transcoding status for an uploaded audio file")
    .option("--json", "Output as JSON")
    .option("--wait", "Wait for transcoding to complete")
    .addHelpText(
      "after",
      `
Arguments:
  uploadId    The upload ID (from 'track upload --no-wait')

Check the transcoding status of a previously uploaded audio file.
Use --wait to poll until transcoding is complete.

Examples:
  $ yoto track status f459ae09377fff45...
  $ yoto track status f459ae09377fff45... --wait
  $ yoto track status f459ae09377fff45... --json
`
    )
    .action((uploadId, options) =>
      getTranscodeStatus(uploadId, { json: options.json, wait: options.wait })
    );
}
