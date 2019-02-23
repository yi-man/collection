const path = require('path')
const cwd = path.resolve(__dirname)
const { CLIEngine } = require('eslint')


const files = ['src']
const extensions = ['.js', '.jsx', '.vue']
const args = {}
const config = Object.assign({
  extensions,
  fix: true,
  cwd
}, {
  "plugins": [
    "tutorial",
    "youzan"
  ]
})
const engine = new CLIEngine(config)
const report = engine.executeOnFiles(files)
const formatter = engine.getFormatter(args.format || 'codeframe')

report.results.forEach(ret => {
  const source = ret.source
  let count = 0
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') {
      count++
    }
  }
  console.log(`${ret.filePath}:${count}\n`)

})

if (report.warningCount || report.errorCount) {
  console.log(formatter(report.results))
}

// console.log(report)
