#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Helper: perform case-preserving replacement of target with replacement
function preserveCaseReplace(text, target, replacement) {
  // Using a global, case-insensitive regex.
  const regex = new RegExp(target, 'gi');
  return text.replace(regex, (match) => {
    if (match === match.toUpperCase()) {
      return replacement.toUpperCase();
    } else if (match === match.toLowerCase()) {
      return replacement.toLowerCase();
    } else if (match[0] === match[0].toUpperCase() &&
               match.slice(1) === match.slice(1).toLowerCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
    } else {
      return replacement;
    }
  });
}

// Copy file from src to dest, while replacing text content accordingly
async function copyAndProcessFile(srcPath, destPath, newName) {
  let content = await fs.readFile(srcPath, 'utf8');
  // Replace "Empty" fragments in file content using preserveCaseReplace.
  const newContent = preserveCaseReplace(content, "Empty", newName);
  await fs.writeFile(destPath, newContent, 'utf8');
  console.log(`Processed file: ${destPath}`);
}

// Recursively copy a directory from srcDir to destDir, processing file names and content.
async function copyDirectory(srcDir, destDir, newName) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcEntryPath = path.join(srcDir, entry.name);
    // Replace "Empty" in file/directory names:
    let newEntryName = preserveCaseReplace(entry.name, "Empty", newName);
    const destEntryPath = path.join(destDir, newEntryName);

    if (entry.isDirectory()) {
      await copyDirectory(srcEntryPath, destEntryPath, newName);
    } else if (entry.isFile()) {
      await copyAndProcessFile(srcEntryPath, destEntryPath, newName);
    }
  }
}

// Prompt user with a question and return the answer
async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

(async () => {
  try {
    // Ask the user for the new name to replace "Empty"
    const newName = await prompt("Enter the new name to replace 'Empty': ");
    if (!newName) {
      console.error("No new name provided. Exiting.");
      process.exit(1);
    }
    // Ask the user for the destination directory (must be under packages)
    let destRelative = await prompt("Enter the destination directory relative to 'packages' (e.g., 'myFaculty/templates'): ");
    if (!destRelative) {
      console.error("No destination provided. Exiting.");
      process.exit(1);
    }
    // Build full destination path; assuming current working directory is monorepo root.
    const destDir = path.resolve(__dirname, '..', 'packages', destRelative, 'src', newName);
    
    // Define source: in our _empty package the templates are under /packages/_empty/src/Empty
    const srcDir = path.resolve(__dirname, '..', 'packages', '_empty', 'src', 'Empty');

    console.log(`Copying from: ${srcDir}`);
    console.log(`Destination: ${destDir}`);
    
    await copyDirectory(srcDir, destDir, newName);
    console.log("Copy and replacement completed.");
  } catch (err) {
    console.error("Error:", err);
  }
})();
