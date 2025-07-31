const fs = require('fs');
const path = require('path');

// Common paths where Cursor extensions are stored
const possiblePaths = [
    // Windows
    process.env.APPDATA ? path.join(process.env.APPDATA, 'Cursor', 'User', 'extensions') : null,
    // macOS
    process.env.HOME ? path.join(process.env.HOME, 'Library', 'Application Support', 'Cursor', 'User', 'extensions') : null,
    // Linux
    process.env.HOME ? path.join(process.env.HOME, '.config', 'Cursor', 'User', 'extensions') : null,
    // Alternative Windows path
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Cursor', 'User', 'extensions') : null
].filter(Boolean); // Remove null values

function findExtensionsDirectory() {
    for (const extPath of possiblePaths) {
        if (fs.existsSync(extPath)) {
            return extPath;
        }
    }
    return null;
}

function getExtensionsList() {
    const extensionsDir = findExtensionsDirectory();
    
    if (!extensionsDir) {
        console.log('Could not find Cursor extensions directory. Please check the paths:');
        possiblePaths.forEach(p => console.log('  -', p));
        return [];
    }
    
    console.log('Found extensions directory:', extensionsDir);
    
    try {
        const extensions = fs.readdirSync(extensionsDir);
        const extensionList = [];
        
        extensions.forEach(ext => {
            // Extensions are typically in folders like "ms-vscode.vscode-typescript-next-5.0.0"
            const match = ext.match(/^([^.]+\.vscode-[^-]+)/);
            if (match) {
                extensionList.push(match[1]);
            }
        });
        
        return [...new Set(extensionList)]; // Remove duplicates
    } catch (error) {
        console.error('Error reading extensions directory:', error.message);
        return [];
    }
}

// Run the script
const extensions = getExtensionsList();
console.log('\nFound extensions:');
extensions.forEach(ext => console.log('  -', ext));

// Write to file
const output = `# Cursor Extensions List

Generated on: ${new Date().toISOString()}

## Extensions Directory:
${findExtensionsDirectory() || 'Not found'}

## Installed Extensions:
${extensions.map(ext => `- ${ext}`).join('\n')}

## Total Extensions: ${extensions.length}
`;

fs.writeFileSync('cursor-extensions.txt', output);
console.log('\nExtensions list saved to cursor-extensions.txt'); 