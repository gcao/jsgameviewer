require 'image_size'
require 'RMagick'
include Magick

def to_sprites(dir)
  dx = 0
  dy = 10
  css_prefix = 'gvsprite-'
  sprite_img = '/jsgameviewer/view/images/sprites.gif'
  excludes = [/sprite.*/,/loading\.gif/]

  Dir.chdir dir
  y = dy / 2
  # depends on ImageMagick
  cmd = "convert "
  sprites = ""
  Dir["**/*.gif"].each do |file|
    next if excludes.detect{|exclude| file =~ exclude}
    #puts file
    size = ImageSize.new(File.open(file))
    img = Image.ping(file)
    w = img[0].columns
    h = img[0].rows
    sprites += <<-SASS
.#{css_prefix}#{file[0..file.index('.')-1].gsub('/','-')}
  width: #{w}px
  height: #{h}px
  background: url(#{sprite_img}) 0 -#{y}px

    SASS
    cmd += "-page +0+#{y} #{file} "
    y += h + dy
  end
  cmd += "-background none -mosaic -bordercolor none sprites.gif"
  system(cmd)

  File.open("../sass/sprites.sass", "w") do |f|
    f.print sprites
  end
end

if __FILE__ == $0
  if ARGV.length == 0
    puts "Usage: #{__FILE__} dir"
    exit
  end
  to_sprites ARGV[0]
end