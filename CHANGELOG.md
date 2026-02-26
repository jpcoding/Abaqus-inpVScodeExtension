# Changelog

All notable changes to the **JP Abaqus** VS Code extension are documented here.

---

## [1.2.0] — 2026-02-26

### Added
- **Keyword-to-keyword block folding** (`extension.js`): a `FoldingRangeProvider` now creates fold regions for every `*KEYWORD` block, ending just before the next keyword. Previously only the four paired blocks (`*STEP`/`*END STEP` etc.) were foldable; now `*NODE`, `*ELEMENT`, `*NSET`, `*MATERIAL`, and all other keywords fold too.
- `editor.showFoldingControls: always` in `configurationDefaults` — fold arrows are always visible in the gutter without hovering.
- `editor.largeFileOptimizations: false` in `configurationDefaults` — large `.inp` files get syntax highlighting out of the box, no manual `settings.json` change required.
- `examples/example_test.inp` — a comprehensive test input file covering all grammar rules and snippets.
- `.vscodeignore` to exclude dev/build artefacts from the published package.

### Fixed
- **Folding markers** (`language-configuration.json`): removed invalid `(?i)` Oniguruma flag — it is not supported in VS Code's JavaScript RegExp engine and was silently disabling all marker-based folding.
- **Snippet inline completion**: removed leading `\r\n` and `*` from all snippet bodies so completions expand inline on the current line (user types `*` then a partial keyword; the snippet fills in the rest on the same line instead of inserting on a new line).
- VS Code category corrected from `Languages` to `Programming Languages`.

---

## [1.1.0] — 2022-01-17

### Added
- `configurationDefaults` raises `editor.maxTokenizationLineLength` to 500,000 — fixes highlighting failures on dense node/element data lines.
- `folding.markers` in `language-configuration.json` for paired blocks: `*Part`/`*End Part`, `*Assembly`/`*End Assembly`, `*Instance`/`*End Instance`, `*Step`/`*End Step`, `*Load Case`/`*End Load Case`.
- 42 snippets covering all common Abaqus keywords, with tab-stop placeholders and full step skeletons for `STATIC`, `DYNAMIC`, `FREQUENCY`, `BUCKLE`, and `HEAT TRANSFER`.
- Rewrote README with Block Folding, Large File Support, Snippets, and Troubleshooting sections.

---

## [1.0.0] — 2017-12-10

### Added
- Initial release.
- Syntax highlighting for Abaqus `.inp`, `.inc`, `.incl` files: keywords, parameters, comments, data lines, and error patterns (space after `*`, lines > 256 chars).
- Basic snippet set for common keywords.
