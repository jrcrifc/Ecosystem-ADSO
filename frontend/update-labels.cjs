const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      content = content.replace(/<label>/g, '<label className="form-label fw-bold" style={{ color: "#0A1628" }}>');
      content = content.replace(/<label className="form-label fw-semibold text-muted">/g, '<label className="form-label fw-bold" style={{ color: "#0A1628" }}>');
      content = content.replace(/<label className="form-label fw-semibold text-muted mb-1">/g, '<label className="form-label fw-bold mb-1" style={{ color: "#0A1628" }}>');
      content = content.replace(/<label className="form-label fw-semibold" style={{ color: "#023E8A" }}>/g, '<label className="form-label fw-bold" style={{ color: "#0A1628" }}>');
      content = content.replace(/<label className="form-label fw-semibold" style=\{\{\s*color:\s*"#023E8A",\s*fontSize:\s*"13px"\s*\}\}>/g, '<label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px" }}>');

      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('c:/Users/Sena/Pictures/Ecosystem-ADSO/frontend/src');
console.log('Done');
