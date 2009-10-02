def template2js template_file, js_file, js_var
  template = IO.readlines(template_file).map{|line| line.strip}.join
  template.gsub!('"', "'")
  template.gsub!('/jsgameviewer', 'http://localhost/jsgameviewer')
  File.open(js_file, 'w') do |f|
    f.print("jsGameViewer.#{js_var} = \"#{template}\";")
  end
end