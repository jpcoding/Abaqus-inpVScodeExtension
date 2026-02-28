// Test the folding regex patterns as VS Code would (JavaScript RegExp)

// OLD broken pattern
try {
    var r = new RegExp('(?i)^\\s*\\*(?!\\*)');
    console.log('OLD start (?i) OK:', r.test('*NODE'));
} catch (e) {
    console.log('OLD start (?i) FAILED:', e.message);
}

// NEW fixed patterns
var startFixed = new RegExp('^\\s*\\*(?!\\*)');
var endFixed = new RegExp('^\\s*\\*[Ee][Nn][Dd]\\s+(([Pp][Aa][Rr][Tt])|([Aa][Ss][Ss][Ee][Mm][Bb][Ll][Yy])|([Ii][Nn][Ss][Tt][Aa][Nn][Cc][Ee])|([Ss][Tt][Ee][Pp])|([Ll][Oo][Aa][Dd]\\s+[Cc][Aa][Ss][Ee]))\\b');

var testLines = [
    '*NODE, NSET=ALL_NODES',
    '** comment',
    '*ELEMENT, TYPE=C3D8R',
    '*STEP',
    '*End Step',
    '*END STEP',
    '*end assembly',
    '1, 0.0, 0.0, 0.0',
];

console.log('\n--- NEW fixed pattern results ---');
testLines.forEach(function (line) {
    var isEnd = endFixed.test(line);
    var isStart = startFixed.test(line);
    console.log(
        (isEnd ? '[END  ]' : isStart ? '[START]' : '[data ]'),
        JSON.stringify(line)
    );
});
