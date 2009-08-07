jQuery(document).ready(function(){
  jQuery(".jsgv").each(function(){
    var idFunc = function(elem) {
      var id = jQuery(elem).attr('id');
      if (!id) {
        id = 'gv' + Math.floor(Math.random()*100000);
        jQuery(elem).attr('id', id);
      }
      return id;
    };
    
    if (this.nodeName == 'A') {
      var url = jQuery(this).attr('href');
      new jsGameViewer.GameController({'container':idFunc(this)}).load(url);
    } else {
      var url = jQuery(this).attr('jsgv-url');
      if (url) {
        new jsGameViewer.GameController({'container':idFunc(this)}).load(url);
      }
    }
  });
});