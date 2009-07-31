jQuery(document).ready(function(){
  jQuery(".jsgv").each(function(){
    var url = jQuery(this).attr('jsgv-url');
    if (url) {
      new jsGameViewer.GameController({'container':jQuery(this)}).load(url);
    }
  });
});