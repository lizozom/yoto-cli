# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2026-07-20

### Fixed

- CommonJS consumers can now actually `require()` the package. The `exports`
  map advertised a `require` condition but pointed it at `dist/lib/index.js`,
  which is ESM, so CJS consumers hit `ERR_REQUIRE_ESM` on any Node without
  `require(esm)` support (< 22.12). The build now emits a real CJS bundle
  (`dist/lib/index.cjs`) alongside the ESM one, and `require` resolves to it.
  `types` also moved first in the condition map, since Node and TypeScript
  both take the first match.
- The `yoto` command now works on macOS and Windows. `bin` pointed at a
  Bun-compiled binary built for the host platform, so `npm install -g` on
  anything but that platform installed a command that could not run.

### Changed

- `bin` is now a plain Node bundle (`dist/cli.js`) instead of a compiled
  binary. This drops the npm tarball from 22.4 MB to 275 kB (63.3 MB to
  1.7 MB unpacked) — the 59 MB binary was being shipped to every consumer,
  including library-only ones.
- Standalone per-platform binaries are still built by `bun run build:all` and
  published as GitHub release assets (what `install.sh` downloads); they are
  no longer included in the npm package.

## [0.2.2] - 2026-06-13

### Fixed

- Transcode polling no longer aborts on the `analyzing` phase. Yoto's transcode
  API reports `analyzing` as a normal in-progress phase, but the poll loops only
  whitelisted `queued`/`processing`/`transcoding`, so uploads intermittently
  failed with `Transcoding failed with status: analyzing`. Added `analyzing`
  (and the missing `transcoding` in `getTranscodeStatus`) to the in-progress
  phases.

## [0.2.0] - 2026-01-01

### Added

- New `entry` command group for managing playlist entries (chapter + track as one unit)
  - `entry add` - Add entry with audio file and optional icon
  - `entry update` - Update title/icon for both chapter and track together
  - `entry delete` - Delete an entry

### Changed

- Renamed `edit` subcommand to `update` across all command groups for consistency
  - `playlist edit` → `playlist update`
  - `chapter edit` → `chapter update`
  - `track edit` → `track update`
- Removed `--file` option from `chapter add` (use `entry add` instead)
- Moved chapter/track documentation to "Advanced" section in README
- Improved playlist structure to match Yoto UI-created playlists:
  - Icons now set on both chapter and track levels
  - Added `overlayLabel`, `format`, `fileSize`, `ambient` fields
  - Added `_originalFileName`, `availableFrom`, `defaultTrackDisplay`, `defaultTrackAmbient` to chapters

## [0.1.0] - 2024-12-16

### Added

- Audio file upload and transcoding support
- Smart file detection for audio sources (file path, yoto:# hash, or URL)
- `track upload` command for standalone audio uploads
- `track status` command to check transcoding progress
- `--on-end` option for track playback behavior (repeat, stop, none)

### Changed

- Restructured CLI to use space-separated subcommands (e.g., `yoto playlist list`)
- Icons now auto-upload when given a file path

## [0.0.1] - 2024-12-15

### Added

- Initial release
- Authentication via device flow (`login`, `logout`, `status`)
- Playlist management (`playlist list`, `show`, `create`, `delete`)
- Chapter management (`chapter add`, `delete`)
- Track management (`track add`, `delete`)
- Icon management (`icon list`, `upload`)
- Device control (`device list`, `show`, `play`, `pause`, `stop`, `next`, `previous`, `volume`)
- Cross-platform binaries (Linux x64/arm64, macOS x64/arm64, Windows x64)
- Install script for easy setup

[0.2.0]: https://github.com/TheBestMoshe/yoto-cli/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/TheBestMoshe/yoto-cli/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/TheBestMoshe/yoto-cli/releases/tag/v0.0.1
