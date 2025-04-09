const { spawn } = require('child_process');
require('dotenv').config();

// Function to run a command and return a promise
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    // Step 1: Initialize landlord from environment variables
    console.log('Step 1: Initializing landlord account from environment variables...');
    await runCommand('node', ['scripts/init-landlord-from-env.js']);
    
    // Step 2: Start the development server
    console.log('Step 2: Starting development server...');
    await runCommand('next', ['dev', '--port', '3000']);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

main();
