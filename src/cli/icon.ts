import { Command } from "commander";
import {
  listPublicIcons,
  listUserIcons,
  uploadIcon,
} from "../commands/icons.ts";

export function registerIconCommands(program: Command): void {
  const icon = program
    .command("icon")
    .description("Manage icons");

  icon
    .command("list")
    .description("List icons (public or your own)")
    .option("--mine", "List only your uploaded custom icons")
    .option("--tag <tag>", "Filter public icons by tag (e.g., music, animals)")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto icon list
  $ yoto icon list --tag music
  $ yoto icon list --mine
  $ yoto icon list --tag animals --json
`
    )
    .action((options) => {
      if (options.mine) {
        return listUserIcons({ json: options.json });
      }
      return listPublicIcons({ json: options.json, tag: options.tag });
    });

  icon
    .command("upload <file>")
    .description("Upload a custom icon image")
    .option("--no-convert", "Skip auto-resize (image must be exactly 16x16 PNG)")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  file    Path to image file (PNG, JPEG, or GIF)

The uploaded icon's mediaId can be used with 'track update --icon' or 'chapter update --icon'.

By default, images are automatically resized to 16x16 pixels.
Use --no-convert if your image is already 16x16 PNG.

Examples:
  $ yoto icon upload ./my-icon.png
  $ yoto icon upload ./my-icon.png --json
  $ yoto icon upload ./16x16-icon.png --no-convert
`
    )
    .action((file, options) =>
      uploadIcon(file, { autoConvert: options.convert, json: options.json })
    );
}
