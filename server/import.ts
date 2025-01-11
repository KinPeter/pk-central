import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { pathToFileURL } from 'url';

export async function importFunctions(functionsDir: string) {
  const files = await readdir(functionsDir);

  for (const file of files) {
    if (extname(file) === '.ts') {
      const filePath = join(functionsDir, file);
      const module = await import(pathToFileURL(filePath).toString());

      // Access default export function and other const object
      const defaultFunction = module.default;
      const exportedObject = module.config;

      console.log('Imported function:', defaultFunction);
      console.log('Imported object:', exportedObject);

      // You can now use the imported function and object
      // defaultFunction();
      // console.log(exportedObject);
    }
  }
}
