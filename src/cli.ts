#!/usr/bin/env bun

import { Command } from "commander";
import { registerAuthCommands } from "./cli/auth.ts";
import { registerPlaylistCommands } from "./cli/playlist.ts";
import { registerEntryCommands } from "./cli/entry.ts";
import { registerChapterCommands } from "./cli/chapter.ts";
import { registerTrackCommands } from "./cli/track.ts";
import { registerIconCommands } from "./cli/icon.ts";
import { registerDeviceCommands } from "./cli/devices.ts";
import { error } from "./utils/output.ts";

const program = new Command();

program
  .name("yoto")
  .description("CLI for the Yoto API")
  .version("0.2.0");

registerAuthCommands(program);
registerDeviceCommands(program);
registerPlaylistCommands(program);
registerEntryCommands(program);
registerChapterCommands(program);
registerTrackCommands(program);
registerIconCommands(program);

program.parseAsync(process.argv).catch((err) => {
  error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
