# encoding: utf-8
require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/contrib'
require 'sinatra/partial'

require 'json'

module AwsPortal
  class Application < Sinatra::Base
    # for "sinatra/content-for"
    register Sinatra::Contrib

    # for "partial 'some_partial', template_engine: :erb"
    register Sinatra::Partial
    set :partial_template_engine, :erb

    # setting for directory path
    set :root, File.join(File.dirname(__FILE__), "..", "..")
    set :views, Proc.new { File.join(root, "views") }

    get '/' do
      content_type :json
      {
        services: [
          "aws"
        ]
      }.to_json
    end

    get '/aws' do
      content_type :json
      {
        services: [
          "iam"
        ]
      }.to_json
    end

    get '/aws/iam' do
      content_type :json
      {
        services: [
          "users"
        ]
      }.to_json
    end

    get '/aws/iam/users' do
      content_type :json
      erb :"aws/iam/users/list.json"
    end

  end
end
