```
██╗   ██╗ ██████╗ ████████╗ ██████╗
╚██╗ ██╔╝██╔═══██╗╚══██╔══╝██╔═══██╗
 ╚████╔╝ ██║   ██║   ██║   ██║   ██║
  ╚██╔╝  ██║   ██║   ██║   ██║   ██║
   ██║   ╚██████╔╝   ██║   ╚██████╔╝
   ╚═╝    ╚═════╝    ╚═╝    ╚═════╝
```

# yoto-cli

A command-line tool (and TypeScript library) for the [Yoto](https://yotoplay.com) API.

Yoto players are audio players for kids that play "Make Your Own" cards you fill with your own
content. Doing that through the Yoto app means a lot of tapping. This CLI does it from your
terminal instead — and, because it is scriptable, lets you bulk-load a whole audiobook or music
library in one go:

- **Playlists** — create, list, update, and delete the cards in your library
- **Audio** — upload local `.mp3`/`.m4a` files; the CLI uploads, waits for Yoto's transcoder, and adds the result to a playlist
- **Icons** — upload custom 16x16 pixel-art icons (auto-resized) or pick from Yoto's public set
- **Devices** — see your players and control playback (play, pause, next, volume)

## Installation

With npm:

```bash
npm install -g @lizozom/yoto
```

Or, without Node — this grabs a standalone binary for your platform and drops it in `~/.local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/lizozom/yoto-cli/main/install.sh | bash
```

Make sure that directory is on your PATH:

```bash
export PATH="$PATH:$HOME/.local/bin"
```

Then check it works:

```bash
yoto --help
```

## Getting a Yoto client ID

Yoto's API uses OAuth, so before you can log in you need a **client ID** — a public identifier for
"the app that is asking for access" (in this case, this CLI running on your machine). It is not a
secret and not a password; you create one yourself, for free, and it takes about a minute.

Yoto used to hand out a shared community client ID, and older versions of this CLI had one baked in.
That one has been disabled, so everyone now brings their own.

1. Go to the [Yoto developer dashboard](https://dashboard.yoto.dev/) and sign in with your normal
   Yoto account.
2. Create a new client. Choose the **public** client type (sometimes labelled "native", "SPA", or
   "no client secret") — a CLI cannot keep a secret, so this is the correct choice.
3. Register this exact **redirect URI** on the client:

   ```
   http://127.0.0.1:8787/callback
   ```

   This is where the CLI catches the login response. If it is missing or differs by even one
   character, Yoto will refuse the login with a redirect-mismatch error.
4. Copy the **client ID** it gives you.

Give it to the CLI either as an environment variable (nice for a shell profile) or a flag:

```bash
export YOTO_CLIENT_ID=your-client-id-here    # add to ~/.zshrc to make it stick
yoto login

# or, one-off:
yoto login --client-id your-client-id-here
```

## Logging in

```bash
yoto login     # opens your browser to authorize
yoto status    # check whether your stored token still works
yoto logout    # remove stored credentials
```

`yoto login` opens your browser to Yoto's sign-in page. Approve the request there, and the browser
redirects back to a small server the CLI runs on `127.0.0.1:8787` just for those few seconds. The
CLI takes it from there and stores your tokens in `~/.yoto-cli/config.json`; you stay logged in, so
this is a one-time step per machine.

Under the hood this is the OAuth Authorization Code flow with PKCE — the standard for CLIs and other
apps that can't hold a client secret. It replaces the older device-code ("enter this code on a web
page") flow, which Yoto has deprecated. If you are upgrading from an older version of this CLI and
see **"Activation Denied"** or a `device_code ... not allowed for the client` error, that's the
deprecation: upgrade, create a client ID as above, and run `yoto login` again.

The token it requests covers reading your library, managing your Make-Your-Own content, and staying
logged in (`family:library:view`, `user:content:manage`, `offline_access`).

### Troubleshooting

| Error | Fix |
| --- | --- |
| `No Yoto client_id` | Set `YOTO_CLIENT_ID` or pass `--client-id`. See above. |
| Redirect URI mismatch | Register `http://127.0.0.1:8787/callback` on the client, exactly. |
| `Port 8787 is in use` | Something else is on that port. Close it and retry. |
| `Activation Denied` / `device_code not allowed` | You're on an old version. Upgrade and log in again. |

## Usage

### Playlists

```bash
yoto playlist list
yoto playlist show <cardId>
yoto playlist create "My Playlist" --description "Description" --author "Author"
yoto playlist update <cardId> --title "New Title"
yoto playlist delete <cardId>
```

### Entries

Entries are the main way to add content to playlists. Each entry creates a chapter with an audio track.

```bash
# Add entry (chapter + track)
yoto entry add <cardId> "Song Title" --file ./audio.mp3
yoto entry add <cardId> "Song Title" --file ./audio.mp3 --icon ./cover.png

# Update entry (updates both chapter and track)
yoto entry update <cardId> <entryIdx> --title "New Title"
yoto entry update <cardId> <entryIdx> --icon ./cover.png

# Delete entry
yoto entry delete <cardId> <entryIdx>
```

### Icons

```bash
yoto icon list                    # list public icons
yoto icon list --tag music        # filter by tag
yoto icon list --mine             # list your custom icons
yoto icon upload ./my-icon.png    # upload custom icon (auto-resizes to 16x16)
```

### Devices

```bash
yoto device list
yoto device show <deviceId>
yoto device play <deviceId>
yoto device pause <deviceId>
yoto device stop <deviceId>
yoto device next <deviceId>
yoto device previous <deviceId>
yoto device volume <deviceId> <0-100>
```

Run `yoto --help` for the full command list.

### A complete example

```bash
export YOTO_CLIENT_ID=your-client-id-here
yoto login

yoto playlist create "Bedtime Stories" --author "Dad"   # prints the new cardId
yoto entry add <cardId> "The Gruffalo" --file ./gruffalo.mp3 --icon ./gruffalo.png
yoto playlist show <cardId>
```

Then link the card in the Yoto app, and it plays on the player.

## Smart File Detection

The CLI automatically detects whether you're providing a file path or an existing ID:

**Audio files** (for `--file` option):
- `./song.mp3` or `/path/to/audio.m4a` → uploads and transcodes automatically

**Icons** (for `--icon` option):
- `./cover.png` or `/path/to/icon.jpg` → uploads automatically
- `abc123def456` → uses existing mediaId

## Advanced: Chapters and Tracks

Under the hood, Yoto playlists have a hierarchical structure:

```
Playlist (Card)
├── Chapter 1          ← Button press 1 on Yoto player
│   ├── Track 1        ← Audio files play sequentially
│   ├── Track 2
│   └── ...
├── Chapter 2          ← Button press 2
│   └── Track 1
└── ...
```

- **Playlist (Card)**: The top-level container, linked to a physical Yoto card
- **Chapter**: Corresponds to button presses on the Yoto player
- **Track**: An audio file. Tracks within a chapter play sequentially

The `entry` command treats chapter + track as one unit (like the Yoto app). For advanced use cases where you need to work with chapters and tracks separately:

### Chapter Commands

```bash
yoto chapter add <cardId> "Chapter Title"              # Empty chapter
yoto chapter add <cardId> "Chapter Title" --icon ./icon.png
yoto chapter update <cardId> <chapterIdx> --title "New Title"
yoto chapter update <cardId> <chapterIdx> --icon ./icon.png
yoto chapter delete <cardId> <chapterIdx>
```

### Track Commands

```bash
# Add track to existing chapter (accepts file path, yoto:# hash, or URL)
yoto track add <cardId> <chapterIdx> "Track Title" ./audio.mp3
yoto track add <cardId> <chapterIdx> "Track Title" "yoto:#abc123"
yoto track add <cardId> <chapterIdx> "Track Title" ./audio.mp3 --icon ./cover.png

# Update track
yoto track update <cardId> <chapterIdx> <trackIdx> --title "New Title"
yoto track update <cardId> <chapterIdx> <trackIdx> --icon ./cover.png
yoto track update <cardId> <chapterIdx> <trackIdx> --on-end repeat  # loop track
yoto track update <cardId> <chapterIdx> <trackIdx> --on-end stop    # pause after track

# Delete track
yoto track delete <cardId> <chapterIdx> <trackIdx>

# Upload audio without adding to playlist
yoto track upload ./audio.mp3
yoto track upload ./audio.mp3 --no-wait
yoto track status <uploadId>
```

## Use as a library

Everything the CLI does is available programmatically:

```ts
import { YotoClient, login } from "@lizozom/yoto";

await login({ clientId: process.env.YOTO_CLIENT_ID });   // browser + PKCE, stores tokens
const client = new YotoClient({ clientId, accessToken, refreshToken });
const playlists = await client.listContent();
```

## Development

```bash
bun dev <command>        # Run without compiling
bun run typecheck        # Type check
bun run build            # Build the CLI + library bundles
bun run build:all        # Build standalone per-platform binaries (for releases)
```

## Build from Source

```bash
git clone https://github.com/lizozom/yoto-cli.git
cd yoto-cli
bun install
bun run build
```

This produces `./dist/cli.js` (the `yoto` command, runs on Node 18+) and the
library bundles in `./dist/lib`. The standalone per-platform binaries that the
install script downloads are built separately with `bun run build:all` — they
are published as GitHub release assets, not shipped in the npm package.
