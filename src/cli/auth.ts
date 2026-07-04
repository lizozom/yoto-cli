import { Command } from "commander";
import { login, logout, status } from "../commands/auth.ts";

export function registerAuthCommands(program: Command): void {
  program
    .command("login")
    .description("Authenticate with your Yoto account (browser, PKCE)")
    .option(
      "--client-id <id>",
      "Yoto public client_id (defaults to the YOTO_CLIENT_ID env var)"
    )
    .addHelpText(
      "after",
      `
Opens a browser to authenticate with your Yoto account using the OAuth
Authorization Code + PKCE flow over a loopback redirect.

Requires a public client from https://dashboard.yoto.dev/ with
http://127.0.0.1:8787/callback registered as a redirect URI. Provide its id
via --client-id or the YOTO_CLIENT_ID environment variable.

Credentials are stored locally in ~/.yoto-cli/config.json.

Examples:
  $ YOTO_CLIENT_ID=xxxx yoto login
  $ yoto login --client-id xxxx
`
    )
    .action((options: { clientId?: string }) =>
      login({ clientId: options.clientId })
    );

  program
    .command("logout")
    .description("Remove stored credentials")
    .addHelpText(
      "after",
      `
Removes stored authentication tokens from ~/.yoto-cli/config.json.

Examples:
  $ yoto logout
`
    )
    .action(logout);

  program
    .command("status")
    .description("Check if you are authenticated")
    .addHelpText(
      "after",
      `
Shows whether you have valid stored credentials.

Examples:
  $ yoto status
`
    )
    .action(status);
}
