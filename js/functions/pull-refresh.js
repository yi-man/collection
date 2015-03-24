  ;(function(){
    var data = {};

    // 标记touchend的时候是否加载数据
    var flag = true;

    // 取数据 生成节点字符串 并插入ajaxContent
    var loadData = function(){
      $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        success: function(json){
          // 隐藏input中的page加1
          currentPage = json['data']['current_page'];
          totalPage = json['data']['total_page'];
          $p.val(currentPage + 1);

          var dataList = json['data']['list'];
          var html = '';
          var obj = [];
          for(var i = 0; i < dataList.length; i++) {
            obj = dataList[i];
            html += '<li><em class="iconRed ib"></em>'
            + obj['ctime'] + '至' + obj['expire_time']
            + '<span class="fr"><span class="red">'
            + obj['money']
            + '</span>元</span>';
          };

          $ajaxContent.append(html);

          // 数据加载完后 可继续请求下一页数据
          flag = true;
        }
      });
    };
    loadData();

    // 往上滑或往上拉加载下一页数据
    var touchup = 'ontouchend' in window ? 'touchend' : 'mouseup';
    var loadNextPage = function(){
      // 当上一条ajax请求加载结束 并且没到最后一页 并且已经滚动到距离底部100px以下的位置
      if(flag && totalPage > currentPage && $(window).height() + $(window).scrollTop() + 100 > getPageHeight()){
        flag = false;
        loadData();
      }
    };

    // 监听touchend事件
    window.addEventListener(touchup, loadNextPage, false);
    window.addEventListener('scroll', loadNextPage, false);

    // 去当前页面高度
    function getPageHeight() {
      var client = document.compatMode == 'BackCompat' ? body : document.documentElement;
      return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, client.clientHeight);
    };
  }());