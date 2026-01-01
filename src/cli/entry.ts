import { Command } from "commander";
import {
  addEntry,
  updateEntry,
  deleteEntry,
} from "../commands/entry.ts";

export function registerEntryCommands(program: Command): void {
  const entry = program
    .command("entry")
    .description("Manage playlist entries (chapter + track as one unit)");

  entry
    .command("add <cardId> <title>")
    .description("Add a new entry (chapter with audio track) to a playlist")
    .option("--file <path>", "Audio file to upload (required)")
    .option("--icon <icon>", "Set icon (file path, mediaId, or yoto:#mediaId)")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID
  title     The entry title (used for both chapter and track)

The --icon option accepts file paths (auto-uploads) or existing IDs.

Examples:
  $ yoto entry add 5ukMR "Morning Song" --file ./song.mp3
  $ yoto entry add 5ukMR "Bedtime Story" --file ./story.mp3 --icon ./cover.png
`
    )
    .action((cardId, title, options) =>
      addEntry(cardId, title, { icon: options.icon, file: options.file, json: options.json })
    );

  entry
    .command("update <cardId> <entryIdx>")
    .description("Update an entry's title or icon (updates both chapter and track)")
    .option("--title <title>", "Update title")
    .option("--icon <icon>", "Update icon (file path, mediaId, or yoto:#mediaId)")
    .addHelpText(
      "after",
      `
Arguments:
  cardId     The playlist card ID
  entryIdx   Entry index (0-based)

The --icon option accepts a file path (auto-uploads) or existing mediaId.

Examples:
  $ yoto entry update 5ukMR 0 --title "New Title"
  $ yoto entry update 5ukMR 1 --icon ./cover.png
  $ yoto entry update 5ukMR 2 --title "Updated" --icon ./new-icon.jpg
`
    )
    .action((cardId, entryIdx, options) =>
      updateEntry(cardId, parseInt(entryIdx, 10), {
        title: options.title,
        icon: options.icon,
      })
    );

  entry
    .command("delete <cardId> <entryIdx>")
    .description("Delete an entry from a playlist")
    .addHelpText(
      "after",
      `
Arguments:
  cardId     The playlist card ID
  entryIdx   Entry index (0-based)

Examples:
  $ yoto entry delete 5ukMR 2
`
    )
    .action((cardId, entryIdx) =>
      deleteEntry(cardId, parseInt(entryIdx, 10))
    );
}
