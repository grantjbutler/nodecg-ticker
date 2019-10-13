const { fork } = require('child_process')
const rimraf = require('rimraf')
const fs = require('fs')

const isProduction = process.env.NODE_ENV === 'production'
const command = isProduction ? 'build' : 'watch'

rimraf('./dashboard', function () {
    fs.readdir('./src/dashboard', { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(`Error fetching files: ${err}`)
            return
        }

        files.filter((file) => { return file.isDirectory() })
            .forEach((file) => {
                console.log(`Forking build process for ${file.name}`)
                
                let args = [
                    '--out-dir',
                    `./dashboard/${file.name}/`,
                    '--public-url',
                    '.'
                ]

                if (isProduction) {
                    args.push('--no-cache')
                }

                fork('node_modules/.bin/parcel', [
                    command,
                    ...args,
                    `./src/dashboard/${file.name}/index.html`
                ])
            })
    })
})