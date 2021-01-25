require "beyond/helpers/alert_box"
require "beyond/helpers/attr"
require "beyond/helpers/icon"
require "beyond/helpers/will_paginate"
module Beyond
  module Helpers
    include AlertBox
    include Attr
    include Icon
    include WillPaginate
  end
end

ActiveSupport.on_load(:action_view) do
  include Beyond::Helpers
end
