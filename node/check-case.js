import fs from 'fs';
import path from 'path';

const checkFile = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') checkFile(fullPath);
    } else if (fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"](\..*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
        const dirname = path.dirname(resolvedPath);
        const basename = path.basename(resolvedPath);
        
        if (fs.existsSync(dirname)) {
          const actualFiles = fs.readdirSync(dirname);
          if (!actualFiles.includes(basename)) {
            const lowerCaseFiles = actualFiles.reduce((acc, f) => {
              acc[f.toLowerCase()] = f;
              return acc;
            }, {});
            if (lowerCaseFiles[basename.toLowerCase()]) {
              console.log(`Case mismatch in ${fullPath}: imported '${importPath}' but actual file is '${lowerCaseFiles[basename.toLowerCase()]}'`);
            } else {
              console.log(`File not found in ${fullPath}: imported '${importPath}'`);
            }
          }
        }
      }
    }
  });
};

checkFile('./');
