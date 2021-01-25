# frozen_string_literal: true

module BeyondForm
  module Inputs
    module CollectionSelect
      extend ActiveSupport::Concern
      include Base

      included do
        # Disabling Metrics/ParameterLists because the upstream Rails method has the same parameters
        # rubocop:disable Metrics/ParameterLists
        def collection_select_with_beyond(method, collection, value_method, text_method, options={}, html_options={})
          form_group_builder(method, options, html_options) do
            input_with_error(method) do
              klass = html_options.fetch(:class) { "" }
              klass = "#{klass} select"
              html_options.merge!(class: klass)
              collection_select_without_beyond(method, collection, value_method, text_method, options, html_options)
            end
          end
        end
        # rubocop:enable Metrics/ParameterLists

        beyond_alias :collection_select
      end
    end
  end
end
