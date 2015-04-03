# More info at https://github.com/guard/guard#readme

guard 'bundler' do
  watch('Gemfile')
end

guard 'shell' do
  #watch(%r{^view2/js/(.+\.coffee)$}) { `coffee -c public/javascripts/$1` }
  watch(%r{^view/js/(.+\.jsx)$}) { `jsx --extension=jsx view/js view/js` }
  watch(%r{^view/sass/.+$}) { `sass view/sass/main.sass view/css/default.css` }
end

guard 'livereload' do
  watch(%r{.+\.(js|coffee|css)})
  #watch(%r{view2/.+})
end

guard 'sass', :input => 'view2/css'
guard 'sass', :input => 'view4/css'

