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

function replaceDocumentText(editor, newText) {
    const document = editor.document;
    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
    );
    return editor.edit(editBuilder => editBuilder.replace(fullRange, newText));
}

function activate(context) {
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(
            { language: 'abaqus' },
            { provideFoldingRanges }
        )
    );

    // Uppercase keywords: lines starting with * (but not **) are uppercased
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.uppercaseKeywords', editor => {
            const lines = editor.document.getText().split('\n');
            const result = lines.map(line =>
                KEYWORD_LINE.test(line) ? line.toUpperCase() : line
            );
            replaceDocumentText(editor, result.join('\n'));
        })
    );

    // Remove all comment lines (lines starting with **)
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.removeComments', editor => {
            const lines = editor.document.getText().split('\n');
            const result = lines.filter(line => !/^\s*\*\*/.test(line));
            replaceDocumentText(editor, result.join('\n'));
        })
    );

    // Remove blank lines (empty or whitespace only)
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.removeBlankLines', editor => {
            const lines = editor.document.getText().split('\n');
            const result = lines.filter(line => /\S/.test(line));
            replaceDocumentText(editor, result.join('\n'));
        })
    );

    // Remove leading spaces from all lines
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.removeLeadingSpaces', editor => {
            const lines = editor.document.getText().split('\n');
            const result = lines.map(line => line.trimStart());
            replaceDocumentText(editor, result.join('\n'));
        })
    );

    // Indent data lines: non-keyword, non-comment lines get one level of indentation
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.indentDataLines', editor => {
            const lines = editor.document.getText().split('\n');
            const result = lines.map(line => {
                if (KEYWORD_LINE.test(line) || /^\s*\*\*/.test(line) || !/\S/.test(line)) {
                    return line;
                }
                return '  ' + line.trimStart();
            });
            replaceDocumentText(editor, result.join('\n'));
        })
    );

    // Uppercase entire file
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('abaqus.uppercaseAll', editor => {
            replaceDocumentText(editor, editor.document.getText().toUpperCase());
        })
    );
}

function deactivate() { }

module.exports = { activate, deactivate };
