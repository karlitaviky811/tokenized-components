const fs = require('fs');
const path = require('path');

function findFiles(dir) {
    const result = [];
    const items = fs.readdirSync(dir, {withFileTypes: true});
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            result.push(...findFiles(fullPath));
        } else if (item.isFile() && (item.name.endsWith('.css') || item.name.endsWith('.scss'))) {
            result.push(fullPath);
        }
    }
    return result;
}

const componentDir = 'projects/crdx-components/src/lib/components';
const overridesDir = 'projects/crdx-components/src/lib/styles/overrides';

const allFiles = findFiles(componentDir).concat(findFiles(overridesDir));
const results = [];

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('* 1%')) {
            const varMatches = [];
            const re = /var\(--([\w-]+)(?:,\s*[\d.]+)?\)/g;
            let m;
            while ((m = re.exec(line)) !== null) {
                varMatches.push('--' + m[1]);
            }
            results.push({
                file: file,
                line: idx + 1,
                lineContent: line.trim(),
                tokens: varMatches
            });
        }
    });
}

console.log('TOTAL_1PCT:' + results.length);
results.forEach(r => {
    console.log('FILE:' + r.file + ':LINE:' + r.line);
    console.log('TOKENS:' + r.tokens.join(','));
    console.log('CONTENT:' + r.lineContent);
});
