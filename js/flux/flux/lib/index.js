/**
 * Created by xuxin on 2018/1/9.
 */
function noop () {}
export default {
  dispatch (event) {
    let cb = findCB(event)
  }
}