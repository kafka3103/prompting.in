const fs = require('fs');
const { execSync } = require('child_process');

try {
  const creds = fs.readFileSync(process.env.USERPROFILE + '/.git-credentials', 'utf8');
  const match = creds.match(/https:\/\/kafka3103:(.*?)@github\.com/);
  const token = match[1];

  console.log('Staging files...');
  execSync('git add -A');

  console.log('Committing changes...');
  execSync('git commit -m "fix(vercel): rename server.js to dev-server.js and configure static rewrites"');

  console.log('Pushing to prompting.in...');
  execSync(`git remote set-url origin "https://kafka3103:${token}@github.com/kafka3103/prompting.in.git"`);
  execSync('git push origin main');

  console.log('Pushing to prompting-in (Vercel linked)...');
  execSync(`git remote set-url origin "https://kafka3103:${token}@github.com/kafka3103/prompting-in.git"`);
  execSync('git push -f origin main');

  console.log('Restoring clean origin URL...');
  execSync('git remote set-url origin "https://github.com/kafka3103/prompting-in.git"');

  console.log('SUCCESS: Pushed to both repositories!');
} catch (e) {
  console.error('Push error:', e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
  process.exit(1);
}
