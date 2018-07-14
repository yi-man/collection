/**
 * Created by xuxin on 2018/4/20.
 */

const fs = require("pn/fs");
  // const fs=require("fs")
  const svg2png = require("svg2png");

fs.readFile("iconfont.svg")
  .then(svg2png)
  .then(buffer => fs.writeFile("dest.png", buffer))
  .catch(e => console.error(e));
