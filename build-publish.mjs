import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const versionParts = packageJson.version.split('.');
versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();
const newVersion = versionParts.join('.');
packageJson.version = newVersion;
writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
execSync('npx prettier --write package.json', { stdio: 'inherit' });
console.log(`Version bumped to ${newVersion}`);

execSync(`docker build -f ./local-server.Dockerfile -t kinp/pk-central:${newVersion} -t kinp/pk-central:latest .`, {
  stdio: 'inherit',
});

execSync(`docker push kinp/pk-central:${newVersion}`, { stdio: 'inherit' });
execSync(`docker push kinp/pk-central:latest`, { stdio: 'inherit' });

console.log(`Docker image tagged with version ${newVersion} and latest has been pushed.`);
