require "beyond/helpers/alert_box"
module Beyond
  module Helpers
    include AlertBox
  end
end

ActiveSupport.on_load(:action_view) do
  include Beyond::Helpers
end
