# More info at https://github.com/guard/guard#readme

guard 'bundler' do
  watch('Gemfile')
end

guard 'shell' do
  #watch(%r{^view2/js/(.+\.coffee)$}) { `coffee -c public/javascripts/$1` }
end

guard 'livereload' do
  watch(%r{.+\.(js|coffee|css)})
  #watch(%r{view2/.+})
end

guard 'sass', :input => 'view2/css'

