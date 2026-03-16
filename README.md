# vscode-abaqus-inp

Abaqus `.inp` language support for VS Code.

https://marketplace.visualstudio.com/items?itemName=JP.abaqus

## Features

- Syntax highlighting for Abaqus keywords, parameters, comments, and data lines
- Block folding for `*Part`, `*Assembly`, `*Instance`, and `*Step` sections
- Snippets for common keywords (see [Snippets](#snippets) below)
- Works with `.inp`, `.inc`, and `.incl` files
- Run Abaqus jobs from the VS Code built-in terminal without leaving the editor

---

## Block Folding

Folding is now supported for **every `*KEYWORD` block** — each keyword line collapses to the next keyword. Click the fold gutter arrow (or press **⌘⌥[** / **Ctrl+Shift+[**) on any `*KEYWORD` line.

Paired blocks with explicit end markers fold precisely:

| Opening keyword | Closing keyword |
|---|---|
| `*Part` | `*End Part` |
| `*Assembly` | `*End Assembly` |
| `*Instance` | `*End Instance` |
| `*Step` | `*End Step` |

All other keyword blocks (e.g. `*Node`, `*Element`, `*Nset`, `*Material`) fold to just before the next `*KEYWORD` line. Keyword matching is case-insensitive; comment lines (`**`) are excluded.

---

## Large File Support

VS Code disables syntax highlighting for very long individual lines (default limit: 20,000 characters). This extension raises that limit to **500,000 characters per line** for all Abaqus files.

Highlighting on files **larger than ~300 KB** is also kept active automatically — `editor.largeFileOptimizations` is disabled by default for Abaqus files, so no manual settings change is needed.

> **Note:** Disabling large-file optimisations on very large files (tens of MB) may slow down the editor. You can override this in your `settings.json` if needed:
> ```json
> "[abaqus]": { "editor.largeFileOptimizations": true }
> ```

> **If highlighting is not working on large files:** check your user or workspace `settings.json` for a conflicting entry. Any value you set manually **overrides** the extension default. If you have `"editor.largeFileOptimizations": true` set anywhere, remove it or explicitly override it:
> ```json
> "[abaqus]": {
>     "editor.largeFileOptimizations": false,
>     "editor.maxTokenizationLineLength": 500000
> }
> ```

> **Hard limit (VS Code engine):** VS Code's tokenizer has a hard-coded [20 MB threshold](https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/model/textModel.ts). Files larger than ~20 MB will not be syntax-highlighted regardless of settings — this is a VS Code limitation, not an extension limitation. See [#30180](https://github.com/microsoft/vscode/issues/30180) and [#191065](https://github.com/microsoft/vscode/issues/191065).

---

## Snippets

Type a keyword prefix and press **Tab** (or select from the IntelliSense suggestion list) to expand a snippet. All placeholders are tab-stops — press **Tab** again to jump to the next field.

### Available snippets

**Model structure**

| Prefix | Expands to |
|---|---|
| `HEADING` | `*HEADING` |
| `PART` | `*PART` / `*END PART` block |
| `ASSEMBLY` | `*ASSEMBLY` / `*END ASSEMBLY` block |
| `INSTANCE` | `*INSTANCE` / `*END INSTANCE` block with translation |
| `STEP` | `*STEP` / `*END STEP` block |
| `INCLUDE` | `*INCLUDE, INPUT=` |
| `RESTART` | `*RESTART, WRITE` |

**Mesh**

| Prefix | Expands to |
|---|---|
| `NODE` | `*NODE` with `NSET` |
| `ELEMENT` | `*ELEMENT` with type and `ELSET` |
| `NSET` | `*NSET` (with optional `GENERATE`) |
| `ELSET` | `*ELSET` (with optional `GENERATE`) |
| `SURFACE` | `*SURFACE` element-based surface |

**Material**

| Prefix | Expands to |
|---|---|
| `MATERIAL` | `*MATERIAL` block with `*DENSITY` and `*ELASTIC` |
| `ELASTIC` | `*ELASTIC` with type |
| `DENSITY` | `*DENSITY` |
| `PLASTIC` | `*PLASTIC` isotropic hardening data |
| `EXPANSION` | `*EXPANSION` thermal expansion coefficient |

**Sections**

| Prefix | Expands to |
|---|---|
| `SOLID SECTION` | `*SOLID SECTION` |
| `SHELL SECTION` | `*SHELL SECTION` with thickness |
| `BEAM SECTION` | `*BEAM SECTION` |
| `BEAM GENERAL SECTION` | `*BEAM GENERAL SECTION` |

**Analysis steps**

| Prefix | Expands to |
|---|---|
| `STATIC` | Full `*STATIC` step with field output |
| `DYNAMIC IMPLICIT` | Full `*DYNAMIC` (implicit) step |
| `DYNAMIC EXPLICIT` | Full `*DYNAMIC, EXPLICIT` step |
| `FREQUENCY` | Full `*FREQUENCY` (Lanczos) step |
| `BUCKLE` | Full `*BUCKLE` step |
| `HEAT TRANSFER` | Full `*HEAT TRANSFER, STEADY STATE` step |

**Loads & boundary conditions**

| Prefix | Expands to |
|---|---|
| `BOUNDARY` | `*BOUNDARY, TYPE=DISPLACEMENT` |
| `BOUNDARY FIXED` | `*BOUNDARY` pinned/fixed shorthand |
| `CLOAD` | `*CLOAD` concentrated load |
| `DLOAD` | `*DLOAD` distributed load |
| `TEMPERATURE` | `*TEMPERATURE` predefined field |
| `INITIAL CONDITIONS STRESS` | `*INITIAL CONDITIONS, TYPE=STRESS` |
| `INITIAL CONDITIONS TEMPERATURE` | `*INITIAL CONDITIONS, TYPE=TEMPERATURE` |

**Contact**

| Prefix | Expands to |
|---|---|
| `CONTACT` | General contact with all-exterior inclusions |
| `CONTACT PAIR` | `*CONTACT PAIR` with interaction and type |
| `SURFACE INTERACTION` | `*SURFACE INTERACTION` |
| `FRICTION` | `*FRICTION` |
| `TIE` | `*TIE` with adjust / position tolerance |

**Constraints & connectors**

| Prefix | Expands to |
|---|---|
| `KINEMATIC COUPLING` | `*COUPLING` + `*KINEMATIC` |
| `DISTRIBUTING COUPLING` | `*COUPLING` + `*DISTRIBUTING` |
| `MPC` | `*MPC` multi-point constraint |
| `EQUATION` | `*EQUATION` linear constraint |
| `RIGID BODY` | `*RIGID BODY` |
| `TRANSFORM` | `*TRANSFORM` local nodal coordinate system |
| `ORIENTATION` | `*ORIENTATION` |

**Output**

| Prefix | Expands to |
|---|---|
| `OUTPUT FIELD` | `*OUTPUT, FIELD` block with node and element output |
| `OUTPUT HISTORY` | `*OUTPUT, HISTORY` block |
| `NODE OUTPUT` | `*NODE OUTPUT` |
| `ELEMENT OUTPUT` | `*ELEMENT OUTPUT` |

### Example — inserting a node definition

1. In an `.inp` file, type `*` then `NOD` — the IntelliSense list shows `NODE` and `NODE OUTPUT`.
2. Select `NODE` and press **Tab** (or **Enter**).
3. The snippet completes inline on the same line:
   ```
   *NODE, NSET=nset_name
   node_number, x, y, z
   ```
4. The cursor lands on `nset_name`. Edit it, then press **Tab** to move to the next field.

---

## Running Abaqus from the Terminal

The VS Code built-in terminal (**Ctrl+`**) lets you submit and monitor Abaqus jobs without leaving the editor.

**Submit a job**
```bash
abaqus job=my_model input=my_model.inp cpus=4 interactive
```

**Common options**

| Option | Description |
|---|---|
| `job=<name>` | Output file base name |
| `input=<file>` | `.inp` file to run |
| `cpus=<n>` | Number of CPU cores |
| `interactive` | Print status to terminal (blocks until done) |
| `double=both` | Run in full double precision |
| `scratch=<dir>` | Scratch directory for temporary files |

**Check job status** (while running without `interactive`)
```bash
abaqus job=my_model status
```

Open a terminal with **Terminal → New Terminal** or **Ctrl+`**, navigate to your working directory, and run the command above. The `.odb`, `.dat`, and `.msg` output files will appear in the same folder and can be opened in Abaqus/Viewer.

---

## Troubleshooting — `.inp` files not recognised

If the extension stops highlighting `.inp` files after an update or reinstall:

1. **Check the language mode** — open an `.inp` file and look at the bottom-right corner of VS Code. It should show **Abaqus**. If it shows **Plain Text** or another language, click it and select *Abaqus* from the list.
2. **Force file association** — add this to your `settings.json` to permanently associate `.inp` with the extension:
   ```json
   "files.associations": {
       "*.inp": "abaqus",
       "*.inc": "abaqus",
       "*.incl": "abaqus"
   }
   ```
3. **Reload the window** — run **Developer: Reload Window** from the Command Palette (**Ctrl+Shift+P** / **⌘⇧P**).
4. **Reinstall** — if the above steps do not help, uninstall the extension, reload VS Code, then reinstall it.

---

## Note

This extension is based on the Sublime Text package by SenhorLucas: https://github.com/SenhorLucas/AbaqusSublimePackage

---

## Changelog

### v1.2.3 — 2026-03-15

- Snippets expanded from 52 to **480** — every keyword in the Abaqus 2016 Keywords Reference Guide now has a completion entry.
- Added terminal usage guide to README.

---

### v1.2.2 — 2026-02-27

- README: documented that manually setting `editor.largeFileOptimizations: true` in `settings.json` overrides the extension default and breaks highlighting on large files. Added troubleshooting steps and a note on VS Code's hard-coded 20 MB tokenization limit.

---

### v1.2.1 — 2026-02-27

- Housekeeping: extension source moved to repo root; README and CHANGELOG now appear correctly on the marketplace page.

---

### v1.2.0 — 2026-02-26

**Block folding (all keywords)**
- Added `extension.js` with a `FoldingRangeProvider` that folds every `*KEYWORD` block to the next keyword — not just the four paired block types. `*Node`, `*Element`, `*Nset`, `*Material` etc. are all now foldable.
- Fixed `language-configuration.json` folding markers: the `(?i)` Oniguruma flag is invalid in VS Code's JavaScript RegExp engine and was silently breaking all marker-based folding. Replaced with valid JS-compatible patterns.
- Added `editor.showFoldingControls: always` to extension defaults so fold arrows are always visible in the gutter.

**Large file support (automatic)**
- Added `editor.largeFileOptimizations: false` to `configurationDefaults` — syntax highlighting on large `.inp` files now works out of the box without any manual settings change.

**Snippet completion (inline)**
- Removed the leading `\r\n` and `*` from all snippet bodies. Snippets now complete inline on the current line: type `*` then a partial keyword, pick from IntelliSense, and the keyword expands on the same line.

**Housekeeping**
- Added `.vscodeignore` to keep the published package clean.
- Added `examples/example_test.inp` — a comprehensive test file covering all grammar rules and snippets.
- Corrected VS Code category from `Languages` to `Programming Languages`.

---

### v1.1.0 — 2022-01-17

**Large file syntax highlighting**
- Added `configurationDefaults` to raise `editor.maxTokenizationLineLength` to 500,000 for all Abaqus files.

**Block folding**
- Added `folding.markers` to `language-configuration.json` for `*Part`, `*Assembly`, `*Instance`, `*Step`, and `*Load Case` paired blocks.

**Snippets** (expanded to 42)
- Added snippets for all common Abaqus keywords with tab-stop placeholders.
- Full step skeletons (`STATIC`, `DYNAMIC`, `FREQUENCY`, `BUCKLE`, `HEAT TRANSFER`) include output request blocks.

**README**
- Rewrote README with Block Folding, Large File Support, Snippets, and Troubleshooting sections.
