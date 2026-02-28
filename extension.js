// Abaqus extension — main entry point
// Provides keyword-to-keyword block folding for .inp / .inc / .incl files.
// Each *KEYWORD line starts a fold that ends just before the next *KEYWORD.

'use strict';

const vscode = require('vscode');

const KEYWORD_LINE = /^\s*\*(?!\*)/;   // matches *KEYWORD but not ** comments

function provideFoldingRanges(document) {
    const ranges = [];
    let foldStart = -1;

    for (let i = 0; i < document.lineCount; i++) {
        const text = document.lineAt(i).text;

        if (KEYWORD_LINE.test(text)) {
            // Close the previous keyword block (ends on the line before this one)
            if (foldStart >= 0 && i - 1 > foldStart) {
                ranges.push(new vscode.FoldingRange(foldStart, i - 1));
            }
            foldStart = i;
        }
    }

    // Close the final block
    if (foldStart >= 0 && document.lineCount - 1 > foldStart) {
        ranges.push(new vscode.FoldingRange(foldStart, document.lineCount - 1));
    }

    return ranges;
}

function activate(context) {
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(
            { language: 'abaqus' },
            { provideFoldingRanges }
        )
    );
}

function deactivate() { }

module.exports = { activate, deactivate };
