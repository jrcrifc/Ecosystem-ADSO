// ============================================================
// 🔍 VALIDACIÓN DE MAYÚSCULAS/MINÚSCULAS EN IMPORTACIONES (check-case.js)
// Este script verifica de forma recursiva que todas las sentencias de importación
// en los archivos JavaScript del proyecto coincidan exactamente en mayúsculas/minúsculas
// con el nombre real de los archivos en el disco. Esto previene errores de "File Not Found"
// al desplegar en servidores Linux (cuyo sistema de archivos es sensible a mayúsculas/minúsculas)
// si el desarrollo se realizó en Windows (que es insensible a ellas).
// Ejecución:
//   node check-case.js
// ============================================================

// Importa fs para operaciones de sistema de archivos
import fs from 'fs';
// Importa path para manejar rutas de archivos
import path from 'path';

// Función recursiva que recorre un directorio y verifica los imports de archivos .js
const checkFile = (dir) => {
  // Obtiene la lista de archivos y directorios en la ruta actual
  const files = fs.readdirSync(dir);
  // Recorre cada elemento del directorio
  files.forEach(file => {
    // Construye la ruta completa del elemento
    const fullPath = path.join(dir, file);
    
    // Si es un directorio y no es node_modules, llama recursivamente a checkFile
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') checkFile(fullPath);
    } 
    // Si es un archivo JavaScript, analiza sus sentencias de importación
    else if (fullPath.endsWith('.js')) {
      // Lee el contenido completo del archivo
      const content = fs.readFileSync(fullPath, 'utf8');
      // Expresión regular para capturar imports relativos (que empiezan con .)
      const importRegex = /import\s+.*?\s+from\s+['"](\..*?)['"]/g;
      let match;
      
      // Itera sobre todas las coincidencias de imports relativos
      while ((match = importRegex.exec(content)) !== null) {
        // Obtiene la ruta del import
        const importPath = match[1];
        // Resuelve la ruta absoluta del archivo importado
        const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
        // Obtiene el directorio del archivo importado
        const dirname = path.dirname(resolvedPath);
        // Obtiene el nombre del archivo importado
        const basename = path.basename(resolvedPath);
        
        // Verifica que el directorio destino exista
        if (fs.existsSync(dirname)) {
          // Lista los archivos reales en el directorio destino
          const actualFiles = fs.readdirSync(dirname);
          
          // Verifica si el nombre exacto (con mayúsculas/minúsculas) existe físicamente
          if (!actualFiles.includes(basename)) {
            // Crea un mapa de nombres en minúsculas a nombres reales
            const lowerCaseFiles = actualFiles.reduce((acc, f) => {
              acc[f.toLowerCase()] = f;
              return acc;
            }, {});
            
            // Verifica si existe un archivo con el mismo nombre pero diferente capitalización
            if (lowerCaseFiles[basename.toLowerCase()]) {
              // Reporta inconsistencia de mayúsculas/minúsculas
              console.log(`⚠️ Inconsistencia de mayúsculas/minúsculas en ${fullPath}:`);
              console.log(`   Se importó '${importPath}' pero el archivo real es '${lowerCaseFiles[basename.toLowerCase()]}'`);
            } else {
              // Reporta archivo no encontrado
              console.log(`❌ Archivo no encontrado en ${fullPath}: se importó '${importPath}'`);
            }
          }
        }
      }
    }
  });
};

// Inicia la verificación desde el directorio raíz del proyecto
checkFile('./');

