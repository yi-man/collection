/**
 * Created by xuxin on 2017/7/24.
 */


function test1 (sec) {
  console.log('main1');

  process.nextTick(function() {
    console.log('process.nextTick1');
  });

  setTimeout(function() {
    console.log('setTimeout');
    process.nextTick(function() {
      console.log('process.nextTick2');
    });
  }, sec);

  new Promise(function(resolve, reject) {
    console.log('promise');
    resolve();
  }).then(function() {
    console.log('promise then');
  });

  console.log('main2');

}

test1(1)

test1(1)