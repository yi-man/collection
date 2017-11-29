/**
 * Created by xuxin on 2017/8/1.
 */
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {

  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}${new Date()}`);
  }, 1000);

  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    process.send({ cmd: 'notifyRequest' });
  }).listen(9000);
}