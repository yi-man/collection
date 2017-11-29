class config {
  constructor(options){
    options = options || {};
    this.posObj = {};
    this.mmToPx = options.mmToPx || 3; // 定义mm换算为px的倍数为3
    this.xx = 0;
    this.yy = 0; // 定义鼠标位置
    this.eles = {
      body: 'body',
      widgetDiv: ".left-widget div",
      inputResize: '.input-resize',
      pap: '.paper',
      centerY: '.center-y',
      centerBox: '.center-box',
      lineX: '.line-x',
      lineY: '.line-y',
      lineXY: '.line-x .line-y',
      widgetUl: '.left-widget ul',
      hr: '.hr',
      txt: '.input-group-btn button',
      cus: '#paper-type-cus',
      paperCusw: '#paper-cus-width',
      paperCush: '#paper-cus-height',
      hid: '#hidden',
      showHtmlCls: '.showHtml',
      showHtmlId: '#showHtml',
      mainCon: '#mainCon',
      rulerX: '.ruler-x',
      numX: '.num-x',
      rulerY: '.ruler-y',
      numY: '.num-y',
    };
    this.eventsMap = {
      'dblclick .title': 'titledblclick',
      'dblclick .input input': 'inputdbclick',
      'click .input span': 'changeFontSize',
      'click .make-hr a': 'makehr',
      'click .change-paper a': 'changepapaer',
      'click #cusGo': 'cusGo',
      'click #toHtml': 'toHtml',
      'click #close': 'close'
    };
  }
}

class base extends config {
  constructor() {
    super();
    this.doc = $(document);
    this.initializeElements();
  }
  bindEvent() {
    this._scanEventsMap(this.eventsMap, true);
  }
  unbindEvent() {
    this._scanEventsMap(this.eventsMap);
  }
  _scanEventsMap(maps, isOn) {
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    var bind = isOn ? this._delegate : this._undelegate;
    for (var keys in maps) {
      if (maps.hasOwnProperty(keys)) {
        var matchs = keys.match(delegateEventSplitter);
        bind(matchs[1], matchs[2], maps[keys].bind(this));
      }
    }
  }
  _delegate(name, selector, func) {
    this.doc.on(name, selector, func);
  }
  _undelegate(name, selector, func) {
    this.doc.off(name, selector, func);
  }
  initializeElements(eles) {
    for (var name in eles) {
      if (eles.hasOwnProperty(name)) {
        this[name] = $(eles[name]);
      }
    }
  }
  destroy() {
    this.unbindEvent();
  }
};


