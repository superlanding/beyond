# frozen_string_literal: true

module BeyondForm
  module Inputs
    module CheckBox
      extend ActiveSupport::Concern
      include Base

      included do
        def check_box_with_beyond(name, options={}, checked_value="1", unchecked_value="0", &block)
          options = options.symbolize_keys!
          check_box_options = options.except(:class, :label, :label_class, :error_message, :help,
                                             :inline, :custom, :hide_label, :skip_label, :wrapper_class)
          check_box_options[:class] = check_box_classes(name, options)

          content_tag(:label, class: check_box_wrapper_class(options)) do
            checkbox_wrap = content_tag(:div, class: "checkbox ripple") do
              concat(check_box_without_beyond(name, check_box_options, checked_value, unchecked_value))
              concat(content_tag(:i, "", class: "icon-checkbox"))
            end
            concat(checkbox_wrap)

            unless options[:skip_label]
              concat(content_tag(:span, check_box_description(name, options, &block)))
            end

            concat(generate_error(name)) if options[:error_message]
          end
        end

        beyond_alias :check_box
      end

      private

      # def check_box_label(name, options, checked_value, &block)
      #   label_name = if options[:multiple]
      #     check_box_value(name, checked_value)
      #   else
      #     name
      #   end
      #   label_options = { class: check_box_label_class(options) }
      #   label_options[:for] = options[:id] if options[:id].present?
      #   label(label_name, check_box_description(name, options, &block), label_options)
      # end

      def check_box_label_name(name, options)
        if options[:multiple]
          check_box_value(name, checked_value)
        else
          name
        end
      end

      def check_box_description(name, options, &block)
        content = block_given? ? capture(&block) : options[:label]
        content || object&.class&.human_attribute_name(name) || name.to_s.humanize
      end

      def check_box_value(name, value)
        # label's `for` attribute needs to match checkbox tag's id,
        # IE sanitized value, IE
        # https://github.com/rails/rails/blob/5-0-stable/actionview/lib/action_view/helpers/tags/base.rb#L123-L125
        "#{name}_#{value.to_s.gsub(/\s/, '_').gsub(/[^-[[:word:]]]/, '').mb_chars.downcase}"
      end

      def check_box_classes(name, options)
        classes = [options[:class]]
        classes << (options[:custom] ? "custom-control-input" : "form-check-input")
        classes << "is-invalid" if error?(name)
        classes << "position-static" if options[:skip_label] || options[:hide_label]
        classes.flatten.compact
      end

      def check_box_label_class(options)
        classes = []
        classes << (options[:custom] ? "custom-control-label" : "form-check-label")
        classes << options[:label_class]
        classes << hide_class if options[:hide_label]
        classes.flatten.compact
      end

      def check_box_wrapper_class(options)
        classes = []
        if options[:custom]
          classes << custom_check_box_wrapper_class(options)
        else
          classes << "form-check"
          classes << "form-check-inline" if layout_inline?(options[:inline])
        end
        classes << options[:wrapper_class] if options[:wrapper_class].present?
        classes.flatten.compact
      end

      def custom_check_box_wrapper_class(options)
        classes = []
        classes << "custom-control"
        classes << (options[:custom] == :switch ? "custom-switch" : "custom-checkbox")
        classes << "custom-control-inline" if layout_inline?(options[:inline])
        classes
      end
    end
  end
end
