require 'rubygems'
require 'thin'
require 'rack'
require 'sinatra'
require "sinatra/reloader" if development?
require 'rack-livereload'
use Rack::LiveReload

class MyApp < Sinatra::Base
  set :public_folder, '.'

  get '/' do
    erb :index
  end
end

run MyApp

