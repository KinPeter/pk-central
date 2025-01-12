import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { pathToFileURL } from 'url';
import { HandlerFunction, Config, ApiFunctionModule } from './types';

export async function importFunctions(functionsDir: string): Promise<ApiFunctionModule[]> {
  const files = await readdir(functionsDir);
  const modules: ApiFunctionModule[] = [];

  for (const file of files) {
    if (extname(file) === '.ts') {
      console.log('Importing file:', file);
      const filePath = join(functionsDir, file);
      const imported = await import(pathToFileURL(filePath).toString());

      const name = file.replace('.ts', '');
      const handler: HandlerFunction = imported.default;
      const config: Config = imported.config;
      const module = { handler, config, name };

      modules.push(module);
      console.log(`Imported ${name}: ${config.path.join(', ')} (${config.method.join(', ')})`);
    }
  }

  return modules;
}
