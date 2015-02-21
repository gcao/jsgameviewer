# sudo port install ImageMagick
# sudo gem install rmagick
# sudo gem install imagesize

$: << File.dirname(__FILE__) + "/lib"

begin
  require 'image_size'
  require 'RMagick'
rescue Exception => e
  puts "Error is thrown: #{e}"
  puts "Run below commands to install ImageMagick, rmagick and imagesize:
sudo port install ImageMagick
sudo gem install rmagick
sudo gem install imagesize
"
end
require 'rubygems'
require 'rake'
require 'open-uri'

require 'translate'

load File.dirname(__FILE__) + '/lib/tasks/image_processing.rake'

DIST_DIR = "dist/jsgameviewer/"

task :clean do
  FileUtils.rm_rf DIST_DIR if File.exist? DIST_DIR
end

desc "Create distribution"
task :dist

FileList[
  '.htaccess',
  'index.html',
  'build/*',
  'examples/*',
  'js/*',
  'php/*.php',
  'view/**/*',
  'view4/**/*'
].exclude('**/_notes', '**/*.rb', '**/*.haml', '**/sass','**/*.sass').each do |source|
  target = File.join(DIST_DIR + source)
  # puts target
  file target => source do
    if File.directory? source
      `mkdir -p #{target}`
    else
      `mkdir -p #{File.dirname(target)}`
      `cp #{source} #{target}`
    end
  end
  task :dist => target
end

desc "Convert HAML templates to localized HTML files"
task :haml2html do
  gem "haml"
  `haml -r #{File.dirname(__FILE__)}/lib/en_us.rb view/templates/weiqi.haml > view/templates/weiqi_en_us.html`
  `haml -r #{File.dirname(__FILE__)}/lib/zh_cn.rb view/templates/weiqi.haml > view/templates/weiqi_zh_cn.html`
  `haml -r #{File.dirname(__FILE__)}/lib/en_us.rb view/templates/daoqi.haml > view/templates/daoqi_en_us.html`
  `haml -r #{File.dirname(__FILE__)}/lib/zh_cn.rb view/templates/daoqi.haml > view/templates/daoqi_zh_cn.html`
end

desc "Convert localized templates to javascript for cross site support"
task :template2js => :haml2html do
  require 'template2js'
  template2js "weiqi", "en_us"
  template2js "weiqi", "zh_cn"
  template2js "daoqi", "en_us"
  template2js "daoqi", "zh_cn"
end
task :dist => :template2js

desc "Convert SASS to stylesheet"
task :sass2css => :sprites do
  `sass view/sass/main.sass > view/default.css`
  `sass view4/css/style.sass > view4/css/style.css`
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
  my_files = %w(js/zh_cn.js
                js/en_us.js
                js/jquery-1.3.2.min.js
                js/base.js
                js/model.js
                js/parser.js
                js/controller.js
                js/updater.js
                view/js/view.js
                js/player.js
               )

  `cat #{my_files.join(' ')} > /tmp/test.js && #{YUI_COMMAND} /tmp/test.js > js/all.js`
end

task :compress_css do
  #`#{YUI_COMMAND} view/default.css > build/compressed.css`
  #`sed -i '' s,/jsgameviewer,http://localhost/jsgameviewer,g build/compressed.css`
end
task :compress => %w(compress_js compress_css)
task :dist => :compress

task :default => :dist
