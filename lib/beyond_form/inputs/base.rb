# frozen_string_literal: true

module BeyondForm
  module Inputs
    module Base
      extend ActiveSupport::Concern

      class_methods do
        def beyond_field(field_name)
          define_method "#{field_name}_with_beyond" do |name, options={}|
            form_group_builder(name, options) do
              prepend_and_append_input(name, options) do
                send("#{field_name}_without_beyond".to_sym, name, options)
              end
            end
          end

          beyond_alias field_name
        end

        def beyond_select_group(field_name)
          with_field_name = "#{field_name}_with_beyond"
          without_field_name = "#{field_name}_without_beyond"
          define_method(with_field_name) do |name, options={}, html_options={}|
            form_group_builder(name, options, html_options) do
              form_group_content_tag(name, field_name, without_field_name, options, html_options)
            end
          end

          beyond_alias field_name
        end

        def beyond_alias(field_name)
          alias_method "#{field_name}_without_beyond".to_sym, field_name
          alias_method field_name, "#{field_name}_with_beyond".to_sym
        end
      end
    end
  end
end
