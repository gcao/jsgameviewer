# sudo port install ImageMagick
# sudo gem install rmagick
# sudo gem install imagesize

require 'rubygems'
require 'rake'
require 'ftools'
require 'fileutils'
require 'open-uri'
require 'lib/sprites'
require 'lib/utils'
require 'lib/translate'
include Utils

grid = 21
size = 19
label_color = '#555555'
label_font = 'Nina'
label_font_size = 15

# DAOQI only configurations
daoqigrid = 19
vbw = 3 # virtual board width
daoqilabel_font_size = 13

task :init

desc "Create Weiqi board"
task :board do
  draw_board(grid, size, label_color, label_font, label_font_size)
end

desc "Create Daoqi board"
task :daoqiboard do
  draw_daoqiboard(daoqigrid, daoqisize)
  draw_vlable(daoqigrid, size, vbw, label_color, label_font, daoqilabel_font_size)
  draw_vlable(daoqigrid, size, vbw, label_color, label_font, daoqilabel_font_size)
end

desc "Create stones"
task :stones do
  redraw_stone_and_dead_stone(BLACK,grid)
  redraw_stone_and_dead_stone(BLACK,daoqigrid)
  redraw_stone_and_dead_stone(WHITE,grid)
  redraw_stone_and_dead_stone(WHITE,daoqigrid)
end

desc "Create marks"
task :marks do
  #draw_mark(MARK_MOVE,grid)
  #draw_mark(MARK_MOVE,daoqigrid)
  draw_mark(MARK_CROSS,grid)
  draw_mark(MARK_CROSS,daoqigrid)
  draw_mark(MARK_TRIANGLE,grid)
  draw_mark(MARK_TRIANGLE,daoqigrid)
  draw_mark(MARK_SQUARE,grid)
  draw_mark(MARK_SQUARE,daoqigrid)
  draw_mark(MARK_CIRCLE,grid)
  draw_mark(MARK_CIRCLE,daoqigrid)
  draw_mark(MARK_BLACK_TERRITORY,grid)
  draw_mark(MARK_BLACK_TERRITORY,daoqigrid)
  draw_mark(MARK_WHITE_TERRITORY,grid)
  draw_mark(MARK_WHITE_TERRITORY,daoqigrid)
end

desc "Create all images"
task :images => [:board, :daoqiboard, :vlabel, :hlabel, :stones, :marks]

desc "Create CSS Sprite classes and image"
task :sprites do
  to_sprites 'view/images'
end

DIST_DIR = "dist/jsgameviewer/"

task :clean do
  FileUtils.rm_rf DIST_DIR if File.exist? DIST_DIR
end

desc "Create distribution"
task :dist

FileList['.htaccess', 'gamewindow.html', 'index.html', 'build/*', 'examples/*', 'js/*', 'php/*.php', 'view/**/*'].exclude('**/_notes').each do |source|
  target = File.join(DIST_DIR + source)
  # puts target
  file target => source do
    if File.directory? source
      File.makedirs target
    else
      File.makedirs File.dirname(target)
      File.copy source, target
    end
  end
  task :dist => target
end

desc "Convert HAML templates to localized HTML files"
task :haml2html do
  gem "haml"
  `haml -r lib/en_us.rb view/templates/weiqi.haml > view/templates/weiqi.html`
  `haml -r lib/zh_cn.rb view/templates/weiqi.haml > view/templates/weiqi_zh_cn.html`
  `haml -r lib/en_us.rb view/templates/daoqi.haml > view/templates/daoqi.html`
  `haml -r lib/zh_cn.rb view/templates/daoqi.haml > view/templates/daoqi_zh_cn.html`
end
task :dist => :haml2html

desc "Create translation files for Javascript"
task :localize_js do
  create_js_translation_for "en_us", "js/en_us.js"
  create_js_translation_for "zh_cn", "js/zh_cn.js"
end
task :dist => :localize_js

task :convert_weiqi_template_to_js do
  template = IO.readlines('view/templates/weiqi.html').map{|line| line.strip}.join
  template.gsub!('"', "'")
  template.gsub!('gv.', 'jsGameViewer.')
  template.gsub!('/jsgameviewer', 'http://localhost/jsgameviewer')
  File.open('js/weiqi_template.js', 'w') do |f|
    f.print("jsGameViewer.WEIQI_TEMPLATE = \"#{template}\";")
  end
end
task :convert_template => :convert_weiqi_template_to_js

YUI_COMMAND = "java -jar lib/yuicompressor-2.4.2.jar"
task :compress_js => [:convert_template] do
  my_files = %w(js/thickbox.js 
                js/base.js
                js/model.js
                js/parser.js
                js/controller.js
                js/player.js
                js/updater.js
                js/weiqi_template.js
                view/js/view.js)
                
  `cat #{my_files.join(' ')} > /tmp/test.js && #{YUI_COMMAND} /tmp/test.js > build/compressed.js`
  
  `cat js/jquery-1.3.2.min.js build/compressed.js > build/compressed_all.js`
end

task :compress_css do
  `#{YUI_COMMAND} view/default.css > build/compressed.css`
  `sed -i '' s,/jsgameviewer,http://localhost/jsgameviewer,g build/compressed.css`
end
task :compress => %w(compress_js compress_css)
task :dist => :compress

task :default => :dist