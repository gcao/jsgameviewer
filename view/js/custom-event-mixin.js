// https://github.com/d4tocchini/customevent-polyfill/blob/master/CustomEvent.js

if (navigator.appName.indexOf("Internet Explorer") >= 0) {
  (function(){

    window.CustomEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    window.CustomEvent.prototype = window.Event.prototype;

  })();
}

var CustomEventMixin = {
  fireCustomEvent: function(type, detail) {
    //console.log('CustomEventMixin.fireCustomEvent', type, detail);
    var el = React.findDOMNode(this);
    var event = new CustomEvent(type, {bubbles: true, detail: detail});
    el.dispatchEvent(event);
  },

  /**
   * Returns a function that fires custom event when invoked.
   * The returned function can serve as handler for click or other
   * DOM events.
   */
  customEventTrigger: function(type, detail) {
    var self = this;
    return function() {
      self.fireCustomEvent(type, detail);
    };
  },

  componentDidMount: function() {
    //console.log('CustomEventMixin.componentDidMount');
    if (this.customEvents) {
      var el = React.findDOMNode(this);
      for (var type in this.customEvents) {
        //console.log(type);
        var handler = this.customEvents[type];
        (function(handler){
          el.addEventListener(type, function(e) {
            handler(e);
          }, false);
        })(handler);
      }
    }
  }

};

