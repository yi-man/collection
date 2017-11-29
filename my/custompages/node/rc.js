
var fs = require("fs")
var conf  = readConf("./node/test.json")

console.log(conf)

function readConf(path) {
  var conf = {}
  try {
    conf = fs.readFileSync(path, "utf-8")
    conf = JSON.parse(conf)
  } catch (e) {
    throw e;
  }
  return conf
}