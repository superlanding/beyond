# frozen_string_literal: true

module BeyondForm
  module ActionViewExtensions
    # This module creates BeyondForm wrappers around the default form_with
    # and form_for methods
    #
    # Example:
    #
    #   beyond_form_for @user do |f|
    #     f.text_field :name
    #   end
    #
    # Example:
    #
    #   beyond_form_with model: @user do |f|
    #     f.text_field :name
    #   end
    module FormHelper
      def beyond_form_for(record, options={}, &block)
        options.reverse_merge!(builder: BeyondForm::FormBuilder)

        with_beyond_form_field_error_proc do
          form_for(record, options, &block)
        end
      end

      def beyond_form_with(options={}, &block)
        options.reverse_merge!(builder: BeyondForm::FormBuilder)

        with_beyond_form_field_error_proc do
          form_with(options, &block)
        end
      end

      def beyond_form_tag(options={}, &block)
        options[:acts_like_form_tag] = true

        beyond_form_for("", options, &block)
      end

      private

      def with_beyond_form_field_error_proc
        original_proc = ActionView::Base.field_error_proc
        ActionView::Base.field_error_proc = BeyondForm.field_error_proc
        yield
      ensure
        ActionView::Base.field_error_proc = original_proc
      end
    end
  end
end

ActiveSupport.on_load(:action_view) do
  include BeyondForm::ActionViewExtensions::FormHelper
end
