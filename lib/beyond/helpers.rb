require "beyond/helpers/alert_box"
require "beyond/helpers/attr"
require "beyond/helpers/icon"
module Beyond
  module Helpers
    include AlertBox
    include Attr
    include Icon
  end
end

ActiveSupport.on_load(:action_view) do
  include Beyond::Helpers
end
