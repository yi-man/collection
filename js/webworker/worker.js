importScripts('script1.js')
// importScripts('script1.js', 'script2.js');

// throw('error')

// self.addEventListener('message', function (e) {
//   console.log(e)
//   self.postMessage('You said: ' + e.data);
// }, false);

self.addEventListener('message', function (e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    case 'unit':
      var uInt8Array = e.data;
      postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString());
      postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength);
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);


// Worker 线程
// self.close();
