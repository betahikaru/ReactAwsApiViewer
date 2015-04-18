# encoding: utf-8
require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

require 'aws_portal/application'

describe AwsPortal::Application do
  include Rack::Test::Methods

  def app
    @app ||= AwsPortal::Application
  end

  end
end
