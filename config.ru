require 'rubygems'
require 'thin'
require 'rack'
require 'sinatra'
require "sinatra/reloader" if development?
require 'rack-livereload'
use Rack::LiveReload

class MyApp < Sinatra::Base
  #set :default_encoding, 'utf-8'
  set :public_folder, '.'

  get '/' do
    erb :index
  end
end

run MyApp

