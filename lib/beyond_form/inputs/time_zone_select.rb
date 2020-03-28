# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TimeZoneSelect
      extend ActiveSupport::Concern
      include Base

      included do
        def time_zone_select_with_beyond(method, priority_zones=nil, options={}, html_options={})
          form_group_builder(method, options, html_options) do
            input_with_error(method) do
              time_zone_select_without_beyond(method, priority_zones, options, html_options)
            end
          end
        end

        beyond_alias :time_zone_select
      end
    end
  end
end
