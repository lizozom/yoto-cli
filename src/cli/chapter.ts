import { Command } from "commander";
import {
  addChapter,
  updateChapter,
  deleteChapter,
} from "../commands/content.ts";

export function registerChapterCommands(program: Command): void {
  const chapter = program
    .command("chapter")
    .description("Manage playlist chapters");

  chapter
    .command("add <cardId> <title>")
    .description("Add a new chapter to a playlist")
    .option("--icon <icon>", "Set chapter icon (file path, mediaId, or yoto:#mediaId)")
    .option("--file <path>", "Audio file to upload and add as a track")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID
  title     The chapter title

The --icon and --file options accept file paths (auto-uploads) or existing IDs.

Examples:
  $ yoto chapter add 5ukMR "Chapter 1"
  $ yoto chapter add 5ukMR "Morning Songs" --icon ./cover.png
  $ yoto chapter add 5ukMR "Bamidbar" --file ./song.mp3 --icon ./icon.jpg
  $ yoto chapter add 5ukMR "Story" --icon abc123def456
`
    )
    .action((cardId, title, options) =>
      addChapter(cardId, title, { icon: options.icon, file: options.file, json: options.json })
    );

  chapter
    .command("edit <cardId> <chapterIdx>")
    .description("Update a chapter's title or icon")
    .option("--title <title>", "Update chapter title")
    .option("--icon <icon>", "Update chapter icon (file path, mediaId, or yoto:#mediaId)")
    .addHelpText(
      "after",
      `
Arguments:
  cardId       The playlist card ID
  chapterIdx   Chapter index (0-based)

The --icon option accepts a file path (auto-uploads) or existing mediaId.

Examples:
  $ yoto chapter edit 5ukMR 0 --title "New Chapter Title"
  $ yoto chapter edit 5ukMR 1 --icon ./cover.png
  $ yoto chapter edit 5ukMR 1 --icon abc123def456
`
    )
    .action((cardId, chapterIdx, options) =>
      updateChapter(cardId, parseInt(chapterIdx, 10), {
        title: options.title,
        icon: options.icon,
      })
    );

  chapter
    .command("delete <cardId> <chapterIdx>")
    .description("Delete a chapter from a playlist")
    .addHelpText(
      "after",
      `
Arguments:
  cardId       The playlist card ID
  chapterIdx   Chapter index (0-based)

Examples:
  $ yoto chapter delete 5ukMR 2
`
    )
    .action((cardId, chapterIdx) =>
      deleteChapter(cardId, parseInt(chapterIdx, 10))
    );
}
