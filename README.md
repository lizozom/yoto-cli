# yoto-cli

CLI for interacting with the Yoto API. Manage playlists, tracks, icons, and devices.

## Installation

### Quick Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/TheBestMoshe/yoto-cli/main/install.sh | bash
```

This installs to `~/.local/bin`. Make sure it's in your PATH:

```bash
export PATH="$PATH:$HOME/.local/bin"
```

### Manual Download

Download the latest tarball for your platform from [GitHub Releases](https://github.com/TheBestMoshe/yoto-cli/releases) and extract it.

### Install from GitHub Package Registry

```bash
npm install -g @thebestmoshe/yoto-cli --registry=https://npm.pkg.github.com
```

## Usage

```bash
# Authenticate
yoto login

# Playlists
yoto playlists
yoto playlist <cardId>
yoto playlist:create "My Playlist" --description "Description"
yoto playlist:delete <cardId>

# Chapters & Tracks
yoto chapter:add <cardId> "Chapter Title"
yoto track:add <cardId> <chapterIdx> "Track Title" <url>
yoto track:update <cardId> <chapterIdx> <trackIdx> --icon <iconId>

# Icons
yoto icons
yoto icons:mine
yoto icons:upload my-icon.png

# Devices
yoto devices
yoto device <deviceId>
yoto device:cmd <deviceId> play|pause|stop|volume <value>
```

Run `yoto --help` for full command list.

## Development

```bash
bun dev <command>        # Run without compiling
bun run typecheck        # Type check
bun run build            # Build binary
```

## Build from Source

```bash
git clone https://github.com/TheBestMoshe/yoto-cli.git
cd yoto-cli
bun install
bun run build
```

The compiled binary will be at `./dist/yoto`.
