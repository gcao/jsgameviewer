# sudo port install ImageMagick
# sudo gem install rmagick
# sudo gem install imagesize

$: << File.dirname(__FILE__) + "/lib"

require 'rubygems'
require 'rake'
require 'ftools'
require 'fileutils'
require 'open-uri'

require 'translate'

load File.dirname(__FILE__) + '/lib/tasks/image_processing.rake'

DIST_DIR = "dist/jsgameviewer/"

task :clean do
  FileUtils.rm_rf DIST_DIR if File.exist? DIST_DIR
end

desc "Create distribution"
task :dist

FileList['.htaccess', 'gamewindow.html', 'index.html', 'build/*', 'examples/*', 'js/*', 'php/*.php', 'view/**/*'
  ].exclude('**/_notes', '**/*.rb', '**/*.haml', '**/*.sass').each do |source|
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
  `haml -r lib/en_us.rb view/templates/weiqi.haml > view/templates/weiqi_en_us.html`
  `haml -r lib/zh_cn.rb view/templates/weiqi.haml > view/templates/weiqi_zh_cn.html`
  `haml -r lib/en_us.rb view/templates/daoqi.haml > view/templates/daoqi_en_us.html`
  `haml -r lib/zh_cn.rb view/templates/daoqi.haml > view/templates/daoqi_zh_cn.html`
end

desc "Convert localized templates to javascript for cross site support"
task :template2js => :haml2html do
  require 'template2js'
  template2js "view/templates/weiqi_en_us.html", "view/templates/weiqi_en_us.js", "WEIQI_TEMPLATE_en_us"
  template2js "view/templates/weiqi_zh_cn.html", "view/templates/weiqi_zh_cn.js", "WEIQI_TEMPLATE_zh_cn"
  template2js "view/templates/daoqi_en_us.html", "view/templates/daoqi_en_us.js", "DAOQI_TEMPLATE_en_us"
  template2js "view/templates/daoqi_zh_cn.html", "view/templates/daoqi_zh_cn.js", "DAOQI_TEMPLATE_zh_cn"
end
task :dist => :haml2html

desc "Convert SASS to stylesheet"
task :sass2css => :sprites do
  gem "haml"
  `sass view/sass/main.sass > view/default.css`
  `sass view/sass/thickbox.sass >> view/default.css`
  `sass view/sass/sprites.sass >> view/default.css`
end
task :dist => :sass2css

desc "Create translation files for Javascript"
task :localize_js do
  create_js_translation_for "en_us", "js/en_us.js"
  create_js_translation_for "zh_cn", "js/zh_cn.js"
end
task :dist => :localize_js

YUI_COMMAND = "java -jar lib/yuicompressor-2.4.2.jar"
task :compress_js do
  my_files = %w(js/en_us.js 
                js/thickbox.js
                js/base.js
                js/model.js
                js/parser.js
                js/controller.js
                js/player.js
                js/updater.js
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