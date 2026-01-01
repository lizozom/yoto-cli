import { Command } from "commander";
import {
  listPlaylists,
  getPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../commands/content.ts";

export function registerPlaylistCommands(program: Command): void {
  const playlist = program
    .command("playlist")
    .description("Manage MYO playlists");

  playlist
    .command("list")
    .description("List your MYO playlists")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto playlist list
  $ yoto playlist list --json
`
    )
    .action((options) => listPlaylists({ json: options.json }));

  playlist
    .command("show <cardId>")
    .description("Get playlist details including chapters and tracks")
    .option("--playable", "Include playable URLs for tracks")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID (e.g., 5ukMR)

Examples:
  $ yoto playlist show 5ukMR
  $ yoto playlist show 5ukMR --playable
  $ yoto playlist show 5ukMR --json
`
    )
    .action((cardId, options) =>
      getPlaylist(cardId, { json: options.json, playable: options.playable })
    );

  playlist
    .command("create <title>")
    .description("Create a new empty playlist")
    .option("--description <desc>", "Set playlist description")
    .option("--author <author>", "Set playlist author")
    .addHelpText(
      "after",
      `
Arguments:
  title    The playlist title

Examples:
  $ yoto playlist create "My Playlist"
  $ yoto playlist create "Bedtime Stories" --description "Relaxing stories" --author "Mom"
`
    )
    .action((title, options) =>
      createPlaylist(title, {
        description: options.description,
        author: options.author,
      })
    );

  playlist
    .command("edit <cardId>")
    .description("Edit playlist properties (title, description, author)")
    .option("--title <title>", "Update playlist title")
    .option("--description <desc>", "Update playlist description")
    .option("--author <author>", "Update playlist author")
    .option("--playback-type <type>", "Update playback type (e.g., linear)")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID

Examples:
  $ yoto playlist edit 5ukMR --title "New Title"
  $ yoto playlist edit 5ukMR --description "Updated description"
  $ yoto playlist edit 5ukMR --title "Stories" --author "Dad"
`
    )
    .action((cardId, options) =>
      updatePlaylist(cardId, {
        title: options.title,
        description: options.description,
        author: options.author,
        playbackType: options.playbackType,
      })
    );

  playlist
    .command("delete <cardId>")
    .description("Delete a playlist")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID

Examples:
  $ yoto playlist delete 5ukMR
`
    )
    .action(deletePlaylist);
}
