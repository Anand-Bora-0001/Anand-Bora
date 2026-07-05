import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function resolveConflictsInDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      resolveConflictsInDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      resolveFile(fullPath);
    }
  }
}

function resolveFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<<<<<<< HEAD')) {
    console.log(`Resolving conflicts in ${filePath}...`);
    // Regular expression to match git conflict markers and extract HEAD content
    // /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [a-f0-9]+\n/g
    
    // We can just use split and iterate to be safe
    const lines = content.split('\n');
    const newLines = [];
    let state = 'NORMAL'; // NORMAL, IN_HEAD, IN_INCOMING
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('<<<<<<< HEAD')) {
        state = 'IN_HEAD';
      } else if (line.startsWith('=======')) {
        if (state === 'IN_HEAD') {
          state = 'IN_INCOMING';
        } else {
          newLines.push(line);
        }
      } else if (line.startsWith('>>>>>>> ')) {
        if (state === 'IN_INCOMING') {
          state = 'NORMAL';
        } else {
          newLines.push(line);
        }
      } else {
        if (state === 'NORMAL' || state === 'IN_HEAD') {
          newLines.push(line);
        }
      }
    }
    
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`Resolved: ${filePath}`);
  }
}

resolveConflictsInDirectory(srcDir);
console.log("Done resolving all conflicts!");
