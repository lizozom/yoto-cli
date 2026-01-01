import { Command } from "commander";
import {
  listDevices,
  getDeviceStatus,
  sendCommand,
} from "../commands/devices.ts";

export function registerDeviceCommands(program: Command): void {
  const device = program
    .command("device")
    .description("Manage Yoto devices");

  device
    .command("list")
    .description("List your Yoto devices")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device list
  $ yoto device list --json
`
    )
    .action((options) => listDevices({ json: options.json }));

  device
    .command("show <deviceId>")
    .description("Get device status (playback state, volume, battery)")
    .option("--json", "Output as JSON")
    .addHelpText(
      "after",
      `
Arguments:
  deviceId    The device ID (from 'yoto device list')

Examples:
  $ yoto device show Y12345678
  $ yoto device show Y12345678 --json
`
    )
    .action((deviceId, options) =>
      getDeviceStatus(deviceId, { json: options.json })
    );

  device
    .command("play <deviceId>")
    .description("Start/resume playback")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device play Y12345678
`
    )
    .action((deviceId) => sendCommand(deviceId, "play"));

  device
    .command("pause <deviceId>")
    .description("Pause playback")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device pause Y12345678
`
    )
    .action((deviceId) => sendCommand(deviceId, "pause"));

  device
    .command("stop <deviceId>")
    .description("Stop playback")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device stop Y12345678
`
    )
    .action((deviceId) => sendCommand(deviceId, "stop"));

  device
    .command("next <deviceId>")
    .description("Skip to next track")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device next Y12345678
`
    )
    .action((deviceId) => sendCommand(deviceId, "next"));

  device
    .command("previous <deviceId>")
    .description("Go to previous track")
    .addHelpText(
      "after",
      `
Examples:
  $ yoto device previous Y12345678
`
    )
    .action((deviceId) => sendCommand(deviceId, "previous"));

  device
    .command("volume <deviceId> <level>")
    .description("Set volume level (0-100)")
    .addHelpText(
      "after",
      `
Arguments:
  deviceId    The device ID
  level       Volume level (0-100)

Examples:
  $ yoto device volume Y12345678 50
  $ yoto device volume Y12345678 0
`
    )
    .action((deviceId, level) => sendCommand(deviceId, "volume", level));
}
