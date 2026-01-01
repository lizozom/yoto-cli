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
    .description("Add an empty chapter to a playlist (use 'entry add' for chapter with audio)")
    .option("--icon <icon>", "Set chapter icon (file path, mediaId, or yoto:#mediaId)")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  cardId    The playlist card ID
  title     The chapter title

This creates an empty chapter without tracks. Use 'yoto entry add' to create
a chapter with an audio track in one step.

Examples:
  $ yoto chapter add 5ukMR "Chapter 1"
  $ yoto chapter add 5ukMR "Morning Songs" --icon ./cover.png
`
    )
    .action((cardId, title, options) =>
      addChapter(cardId, title, { icon: options.icon, json: options.json })
    );

  chapter
    .command("update <cardId> <chapterIdx>")
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
  $ yoto chapter update 5ukMR 0 --title "New Chapter Title"
  $ yoto chapter update 5ukMR 1 --icon ./cover.png
  $ yoto chapter update 5ukMR 1 --icon abc123def456
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
