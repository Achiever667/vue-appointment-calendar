import { spawn } from 'node:child_process'

const child = spawn(
  process.execPath,
  ['./node_modules/vite/bin/vite.js', 'build'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      BUILD_TARGET: 'lib'
    }
  }
)

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
