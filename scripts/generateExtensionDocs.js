const fs = require('fs');
const path = require('path');

const extensionsDir = path.join(__dirname, '..', 'extensions');
const outputDir = path.join(__dirname, '..', 'docs', 'extension-architecture');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function isExtensionDir(name) {
  if (name.startsWith('.')) return false;
  const fullPath = path.join(extensionsDir, name);
  if (!fs.statSync(fullPath).isDirectory()) return false;
  if (name.endsWith('.json') || name.endsWith('.js')) return false;
  return true;
}

function resolveNlsValue(value, extDir) {
  if (typeof value !== 'string') return value;
  const match = /^%([^%]+)%$/.exec(value);
  if (!match) return value;
  const nlsPath = path.join(extDir, 'package.nls.json');
  if (!fs.existsSync(nlsPath)) return value;
  const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  return nls[match[1]] || value;
}

for (const ext of fs.readdirSync(extensionsDir).filter(isExtensionDir)) {
  const extDir = path.join(extensionsDir, ext);
  const pkgPath = path.join(extDir, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const name = pkg.name || ext;
  const displayName = resolveNlsValue(pkg.displayName || name, extDir);
  const description = resolveNlsValue(pkg.description || '', extDir);
  const main = pkg.main || 'N/A';
  const activationEvents = Array.isArray(pkg.activationEvents) ? pkg.activationEvents.join(', ') : 'N/A';
  const contributes = pkg.contributes ? Object.keys(pkg.contributes).join(', ') : 'N/A';

  const doc = `# ${displayName}\n\n` +
    `**Extension ID:** ${name}\n\n` +
    (description ? `${description}\n\n` : '') +
    `* **Entry Point:** \`${main}\`\n` +
    `* **Activation Events:** ${activationEvents}\n` +
    `* **Contribution Points:** ${contributes}\n`;

  const outPath = path.join(outputDir, `${ext}.md`);
  fs.writeFileSync(outPath, doc);
  console.log(`Generated ${outPath}`);
}
