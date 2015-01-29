/**
 * Created by xuxin on 15-1-26.
 */

function Stack(){
  this.dataStore = []
  this.top    = 0;
  this.push   = push
  this.pop    = pop
  this.peek   = peek
  this.length = length;
}

function push(element){
  this.dataStore[this.top++] = element;
}

function peek(element){
  return this.dataStore[this.top-1];
}

function pop(){
  return this.dataStore[--this.top];
}

function clear(){
  this.top = 0
}

function length(){
  return this.top
}

/*
* 例子1
* 回数的判断
* */
function isPalindrome(word) {
  var s = new Stack()
  for (var i = 0; i < word.length; i++) {
    s.push(word[i])
  }
  var rword = "";
  while (s.length() > 0) {
    rword += s.pop();
  }
  if (word == rword) {
    return true;
  } else {
    return false;
  }
}

isPalindrome("aarra") //false
isPalindrome("aaraa") //true


/*
* 例子2
* factorial
* 如  5! = 5 * 4 * 3 * 2 * 1 = 120
* */
function fact(n) {
  var s = new Stack()
  while (n > 1) {
    //[5,4,3,2]
    s.push(n--);
  }
  var product = 1;
  while (s.length() > 0) {
    product *= s.pop();
  }
  return product;
}

fact(5) //120