const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';

const TASKS = {
  setup: [
    ['backend', ['install']],
    ['frontend', ['install']]
  ],
  check: [
    ['backend', ['run', 'check']],
    ['frontend', ['run', 'doctor']],
    ['frontend', ['run', 'export:web', '--', '--output-dir', 'dist-check']]
  ],
  seed: [
    ['backend', ['run', 'seed']]
  ],
  'build:web': [
    ['frontend', ['run', 'export:web']]
  ]
};

function run(cwd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(npm, args, {
      cwd: path.resolve(process.cwd(), cwd),
      shell: isWindows,
      stdio: 'inherit',
      windowsHide: true
    });

    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${npm} ${args.join(' ')} failed in ${cwd} with code ${code}`));
      }
    });
  });
}

async function runSequential(tasks) {
  for (const [cwd, args] of tasks) {
    await run(cwd, args);
  }
}

async function runDev() {
  const backend = spawn(npm, ['run', 'dev'], {
    cwd: path.resolve(process.cwd(), 'backend'),
    shell: isWindows,
    stdio: 'inherit',
    windowsHide: true
  });

  const frontend = spawn(npm, ['run', 'web'], {
    cwd: path.resolve(process.cwd(), 'frontend'),
    shell: isWindows,
    stdio: 'inherit',
    windowsHide: true
  });

  const shutdown = () => {
    backend.kill();
    frontend.kill();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function main() {
  const taskName = process.argv[2] || 'check';

  if (taskName === 'dev') {
    await runDev();
    return;
  }

  const tasks = TASKS[taskName];
  if (!tasks) {
    throw new Error(`Unknown task "${taskName}". Use setup, check, dev, seed, or build:web.`);
  }

  await runSequential(tasks);

  if (taskName === 'check') {
    fs.rmSync(path.resolve(process.cwd(), 'frontend', 'dist-check'), {
      force: true,
      recursive: true
    });
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
