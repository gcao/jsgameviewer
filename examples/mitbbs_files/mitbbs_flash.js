function play_flash(src, w, h)
{
	html = '';
 	html += '<object type="application/x-shockwave-flash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="'+w+'" height="'+h+'">';
 	html += '<param name="movie" value="'+src+'">';
    html += '<embed src="'+src+'" width="'+w+'" height="'+h+'" type="application/x-shockwave-flash"></embed>';
	html += '</object>';
	document.write(html);
}
