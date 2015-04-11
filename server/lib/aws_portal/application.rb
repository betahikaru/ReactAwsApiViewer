# encoding: utf-8
require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/contrib'
require 'sinatra/partial'

require 'json'

require 'aws-sdk'
require 'dotenv'

module AwsPortal
  class Application < Sinatra::Base
    # for Reload
    configure :development do
        register Sinatra::Reloader
    end

    # for "sinatra/content-for"
    register Sinatra::Contrib

    # for "partial 'some_partial', template_engine: :erb"
    register Sinatra::Partial
    set :partial_template_engine, :erb

    # setting for directory path
    set :root, File.join(File.dirname(__FILE__), "..", "..")
    set :views, Proc.new { File.join(root, "views") }

    # dotenv
    Dotenv.load

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
      begin
        client = Aws::IAM::Client.new
        resource = Aws::IAM::Resource.new(client: client)
        users_obj = resource.users
        users = []
        users_obj.each do |user_obj|
          users.push({
            UserName: user_obj.name,
            Path: user_obj.path,
            CreateDate: user_obj.create_date,
            UserId: user_obj.user_id,
            Arn: user_obj.arn
          })
        end
        {
          Users: users
        }.to_json
      rescue => error
        p error
        return {}.to_json
      end
    end

  end
end
