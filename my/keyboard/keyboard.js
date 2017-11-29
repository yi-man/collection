/**
 * Created by xuxin on 2017/9/26.
 */

let dom = document
function scrollTo (y, _y, t, s, r) {
  r = r == undefined ? 1 : r
  y = y == undefined ? top.scrollY : y
  if (r == 1 ? y > _y : y < _y) return
  s = s == undefined ? Math.abs((_y - y) / t * 17.6) : s
  rAF(function () {
    top.scrollTo(0, y += r * s)
    scrollTo(y, _y, t, s, r)
  })
}

function visibility () {
  if (this.moving || this.wheeling) {
    var top = dom.offset().top
    var height = dom.offsetHeight
    var viewTop = keyboardHeight + scrollOffsetTop
    var viewBottom = factWindowHeight - scrollOffsetBottom

    if (top + height <= viewTop || top >= viewBottom) {
      dom.blur()
    }
  }
}

function refreshCursor () {
  rAF(function () {
    dom.getSelectionRangeInsert('')
  })
}

function getScroll () {
  var scroller = reactScroller || dom.closest('scroll')

  scroll = scroller ? scroller.scrollEvent : null

  if (type == 1) {
    minScrollY = scroll.minScrollY
  }
}

function getViewOffset () {
  // android : (top.scrollY == 0 ? keyboardHeight : 0)
  viewOffset = viewCenter - rangeOffset.top - (top.scrollY == 0 ? keyboardHeight : 0) + (that.module.config.sandbox ? keyboardHeight : 0)

  return viewOffset
}

function keyboardUp (e) {
  getScroll(1)

  if (!scroll) return

  // refresh cursor {{

  if (device.os.ios && device.os.iosVersion < 12) {
    scroll.on('scroll scrollend', refreshCursor)
  }

  // }}

  if (normal) return

  function upend (e) {

    window.keyboard.height = keyboardHeight = top.scrollY || factWindowHeight - top.innerHeight

    // change minScrollY

    scroll.minScrollY = minScrollY + keyboardHeight
    scroll.options.minScrollY = scroll.minScrollY

    // 光标位置

    rangeOffset = dom.getSelectionRangeOffset()

    // 可见视图的中心

    viewWrapper = factWindowHeight - keyboardHeight - scrollOffsetTop - scrollOffsetBottom
    viewCenter = keyboardHeight + viewWrapper / 2

    scroll.scrollBy(0, getViewOffset(), 600, null, false)

    // 滚动到不可见区域时 blur

    scroll.on('scroll', visibility)

    window.trigger('keyboardup', {
      height: keyboardHeight
    })

    if (reactResize) {
      scrollTo(null, 0, 300, null, -1)
    }
  }

  setTimeout(function () {

    top.one('scrollend', upend)

    // no scroll

    setTimeout(function () {
      if (keyboardHeight == 0) upend()
    }, 300)

    // ``` old

    var offset = 0

    if (device.os.mobileSafari && device.os.iosVersion < 12) {
      offset = 24 * viewportScale
    }

    // scroll to bottom

    scrollTo(null, viewportHeight - offset, 300, null, 1)

  }, 300)
}

function keyboardDown () {
  getScroll()

  if (!scroll) return

  // ``` old : refresh cursor {{

  if (device.os.ios && device.os.iosVersion < 11) {
    scroll.off('scroll scrollend', refreshCursor)
  }

  // }}

  if (normal) return
  if (keyboardHeight == 0) return false

  top.scrollTo(0, 0)
  scroll.wrapper.scrollTop = 0

  // change minScrollY

  scroll.minScrollY = minScrollY
  scroll.options.minScrollY = minScrollY
  scroll.off('scroll', visibility)
  scroll._refresh()

  window.keyboard.height = keyboardHeight = 0
}

function selectionRange (e) {
  getScroll()

  if (!scroll) return

  // 非箭头按键取消

  if (e.type == 'keyup' && ![8, 13, 37, 38, 39, 40].consistOf(e.keyCode)) return

  // 重置光标位置

  if (reactOffset) {
    rangeOffset = dom.getSelectionRangeOffset()
  } else if (reactPosition) {
    rangeOffset = dom.getSelectionRangePosition()
  }

  if (reactOrigin && rangeOffset) {
    rangeOffset.each(function (i, v) {
      scope.setValueOfHref(reactOrigin + '.' + i, v)
    })
  }

  if (normal) return

  // 光标居中

  if (e.type == 'input' && e.timeStamp - timeStamp < 2000) return
  if (!scroll || !viewCenter) return
  if (!reactOffset) {
    rangeOffset = dom.getSelectionRangeOffset()
  }

  timeStamp = e.timeStamp

  scroll.scrollBy(0, getViewOffset(), 400, null, false)
}

dom.on('click', checkChange)
dom.on('focus', keyboardUp)
dom.on('blur', keyboardDown)
dom.on('focus keyup input paste mouseup', selectionRange)
}