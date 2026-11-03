if ENV["COVERAGE"]
  require "simplecov"
  SimpleCov.start { add_filter "/test/" }
end

require "rails"
require "active_model"
require "action_controller/railtie"
require "action_view/railtie"
require "action_view/test_case"
require "will_paginate/collection"
require "minitest/autorun"
require "nokogiri"
require "beyond_rails"

class User
  include ActiveModel::Model
  attr_accessor :name, :email, :role, :admin
end

module HtmlHelpers
  # 解析 view helper 的輸出，用 CSS selector 驗證結構，避免綁死屬性順序
  def frag(html)
    Nokogiri::HTML.fragment(html.to_s)
  end
end
