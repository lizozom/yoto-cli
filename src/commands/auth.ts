import http from "http";
import { spawn } from "child_process";
import { YotoClient } from "../api/client.ts";
import type { TokenResponse } from "../api/schemas.ts";
import {
  loadConfig,
  saveConfig,
  clearConfig,
  getConfigPath,
} from "../utils/config.ts";
import { success, error, info } from "../utils/output.ts";

// Loopback redirect for the PKCE flow. This exact URI must be registered on the
// client in the Yoto developer dashboard (https://dashboard.yoto.dev/).
const CALLBACK_PORT = 8787;
const REDIRECT_URI = `http://127.0.0.1:${CALLBACK_PORT}/callback`;

export interface LoginOptions {
  // Your Yoto public client_id. Falls back to the YOTO_CLIENT_ID env var.
  clientId?: string;
  // Override the requested OAuth scopes.
  scope?: string;
  // Receive the authorize URL instead of the default (open browser + log it).
  onAuthorizeUrl?: (url: string) => void;
}

function resolveClientId(explicit?: string): string {
  const clientId = explicit ?? process.env.YOTO_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error(
      "No Yoto client_id. Pass { clientId } or set YOTO_CLIENT_ID.\n" +
        "Create a public client at https://dashboard.yoto.dev/ and register\n" +
        `${REDIRECT_URI} as a redirect URI.`
    );
  }
  return clientId;
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args =
    process.platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    // If we can't launch a browser, the caller still printed the URL to visit.
  }
}

export async function login(options: LoginOptions = {}): Promise<void> {
  const clientId = resolveClientId(options.clientId);
  const client = new YotoClient({ clientId });
  const pkce = YotoClient.generatePKCE();
  const authorizeUrl = client.buildAuthorizeUrl({
    redirectUri: REDIRECT_URI,
    codeChallenge: pkce.challenge,
    state: pkce.state,
    scope: options.scope,
  });

  const tokens = await new Promise<TokenResponse>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://127.0.0.1:${CALLBACK_PORT}`);
      if (url.pathname !== "/callback") {
        res.writeHead(404).end("Not found");
        return;
      }

      const reply = (message: string) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<html><body style="font-family:sans-serif;text-align:center;padding:3rem">` +
            `<h2>${message}</h2><p>You can close this tab and return to the terminal.</p></body></html>`
        );
      };
      const finish = (fn: () => void) => {
        server.close();
        fn();
      };

      const authError = url.searchParams.get("error");
      if (authError) {
        reply("❌ Authorization failed");
        finish(() =>
          reject(
            new Error(
              `${authError}: ${url.searchParams.get("error_description") ?? ""}`
            )
          )
        );
        return;
      }

      if (url.searchParams.get("state") !== pkce.state) {
        reply("❌ State mismatch");
        finish(() => reject(new Error("State mismatch — aborting for safety.")));
        return;
      }

      try {
        const result = await client.exchangeCodeForToken({
          code: url.searchParams.get("code") ?? "",
          codeVerifier: pkce.verifier,
          redirectUri: REDIRECT_URI,
        });
        reply("✅ Logged in to Yoto");
        finish(() => resolve(result));
      } catch (err) {
        reply("❌ Token exchange failed");
        finish(() => reject(err));
      }
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        reject(
          new Error(
            `Port ${CALLBACK_PORT} is in use. Close whatever is using it and retry.`
          )
        );
      } else {
        reject(err);
      }
    });

    const timeout = setTimeout(
      () => {
        server.close();
        reject(new Error("Authorization timed out. Please try again."));
      },
      5 * 60 * 1000
    );
    server.on("close", () => clearTimeout(timeout));

    server.listen(CALLBACK_PORT, "127.0.0.1", () => {
      if (options.onAuthorizeUrl) {
        options.onAuthorizeUrl(authorizeUrl);
      } else {
        info("Opening your browser to authorize. If it does not open, visit:");
        console.log(`\n${authorizeUrl}\n`);
        info("Waiting for authorization...");
        openBrowser(authorizeUrl);
      }
    });
  });

  await saveConfig({
    clientId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });

  success("Successfully logged in!");
  info(`Config saved to ${getConfigPath()}`);
}

export async function logout(): Promise<void> {
  await clearConfig();
  success("Logged out. Credentials removed.");
}

export async function status(): Promise<void> {
  const config = await loadConfig();

  if (!config?.accessToken) {
    info("Not logged in. Run 'yoto login' to authenticate.");
    return;
  }

  const client = new YotoClient({
    clientId: config.clientId,
    accessToken: config.accessToken,
    refreshToken: config.refreshToken,
  });

  try {
    await client.listContent();
    success("Logged in and token is valid.");
  } catch {
    error("Token may be expired. Try 'yoto login' to re-authenticate.");
  }
}

export async function getAuthenticatedClient(): Promise<YotoClient> {
  const config = await loadConfig();

  if (!config?.accessToken) {
    error("Not logged in. Run 'yoto login' first.");
    process.exit(1);
  }

  return new YotoClient({
    clientId: config.clientId,
    accessToken: config.accessToken,
    refreshToken: config.refreshToken,
  });
}
