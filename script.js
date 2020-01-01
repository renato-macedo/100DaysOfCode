const { exec } = require('child_process');
const { appendFileSync } = require('fs');
const { promisify } = require('util');
const execute = promisify(exec);

const args = process.argv;

let day, message, relevant;


if (args.includes('-d')) {
  day = args[args.indexOf('-d') + 1];
}
if (args.includes('-m')) {
  message = args[args.indexOf('-m') + 1];
}
if (args.includes('-l')) {
  relevant = args[args.indexOf('-l') + 1];
}


if (!day || !message) {
  console.error('Missing args')
  process.exit(1);
}

const TEMPLATE = text =>
  `
## Day ${day}

${text}

${relevant ? `[link](${relevant})` : ''}
`;

appendFileSync('README.md', TEMPLATE(message));

// commit 
(async function () {

  try {
    await command('git add .');

    await command(`git commit -m "day ${day}"`);

    await command('git push -u origin master');

  } catch (error) {
    console.log(error.message);
  }

})()


async function command(command) {
  try {
    await execute(command);

  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}