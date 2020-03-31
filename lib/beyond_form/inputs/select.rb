# frozen_string_literal: true

module BeyondForm
  module Inputs
    module Select
      extend ActiveSupport::Concern
      include Base

      included do
        def select_with_beyond(method, choices=nil, options={}, html_options={}, &block)
          form_group_builder(method, options, html_options) do
            prepend_and_append_input(method, options) do
              klass = html_options.fetch(:class) { "" }
              klass = "#{klass} select"
              html_options.merge!(class: klass)
              select_without_beyond(method, choices, options, html_options, &block)
            end
          end
        end

        beyond_alias :select
      end
    end
  end
end
