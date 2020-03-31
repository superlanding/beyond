# frozen_string_literal: true

module BeyondForm
  module Inputs
    module GroupedCollectionSelect
      extend ActiveSupport::Concern
      include Base

      included do
        # Disabling Metrics/ParameterLists because the upstream Rails method has the same parameters
        # rubocop:disable Metrics/ParameterLists
        def grouped_collection_select_with_beyond(method, collection, group_method,
                                                     group_label_method, option_key_method,
                                                     option_value_method, options={}, html_options={})
          form_group_builder(method, options, html_options) do
            input_with_error(method) do
              klass = html_options.fetch(:class) { "" }
              klass = "#{klass} select"
              html_options.merge!(class: klass)
              grouped_collection_select_without_beyond(method, collection, group_method,
                                                          group_label_method, option_key_method,
                                                          option_value_method, options, html_options)
            end
          end
        end
        # rubocop:enable Metrics/ParameterLists

        beyond_alias :grouped_collection_select
      end
    end
  end
end
