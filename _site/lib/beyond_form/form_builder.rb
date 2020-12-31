# require 'beyond_form/aliasing'

module BeyondForm
  class FormBuilder < ActionView::Helpers::FormBuilder
    attr_reader :layout, :label_col, :control_col, :has_error, :inline_errors,
                :label_errors, :acts_like_form_tag

    include BeyondForm::Helpers::Beyond

    include BeyondForm::FormGroupBuilder
    include BeyondForm::FormGroup
    include BeyondForm::Components

    include BeyondForm::Inputs::Base
    include BeyondForm::Inputs::CheckBox
    include BeyondForm::Inputs::CollectionCheckBoxes
    include BeyondForm::Inputs::CollectionRadioButtons
    include BeyondForm::Inputs::CollectionSelect
    include BeyondForm::Inputs::ColorField
    include BeyondForm::Inputs::DateField
    include BeyondForm::Inputs::DateSelect
    include BeyondForm::Inputs::DatetimeField
    include BeyondForm::Inputs::DatetimeLocalField
    include BeyondForm::Inputs::DatetimeSelect
    include BeyondForm::Inputs::EmailField
    include BeyondForm::Inputs::FileField
    include BeyondForm::Inputs::GroupedCollectionSelect
    include BeyondForm::Inputs::MonthField
    include BeyondForm::Inputs::NumberField
    include BeyondForm::Inputs::PasswordField
    include BeyondForm::Inputs::PhoneField
    include BeyondForm::Inputs::RadioButton
    include BeyondForm::Inputs::RangeField
    include BeyondForm::Inputs::RichTextArea if Rails::VERSION::MAJOR >= 6
    include BeyondForm::Inputs::SearchField
    include BeyondForm::Inputs::Select
    include BeyondForm::Inputs::TelephoneField
    include BeyondForm::Inputs::TextArea
    include BeyondForm::Inputs::TextField
    include BeyondForm::Inputs::TimeField
    include BeyondForm::Inputs::TimeSelect
    include BeyondForm::Inputs::TimeZoneSelect
    include BeyondForm::Inputs::UrlField
    include BeyondForm::Inputs::WeekField

    delegate :content_tag, :capture, :concat, to: :@template

    # rubocop:disable Metrics/AbcSize
    def initialize(object_name, object, template, options)
      @layout = options[:layout] || default_layout
      @label_col = options[:label_col] || default_label_col
      @control_col = (options[:control_col] || default_control_col) + " col-form-field"
      @label_errors = options[:label_errors] || false

      @inline_errors = if options[:inline_errors].nil?
                         @label_errors != true
                       else
                         options[:inline_errors] != false
                       end
      @acts_like_form_tag = options[:acts_like_form_tag]
      add_form_role_and_form_inline options
      default_autocomplete_off options
      super
    end
    # rubocop:enable Metrics/AbcSize

    def add_form_role_and_form_inline(options)
      options[:html] ||= {}
      options[:html][:role] ||= "form"

      return unless options[:layout] == :inline

      options[:html][:class] = [options[:html][:class], "form-inline"].compact.join(" ")
    end

    def default_autocomplete_off(options)
      options[:html] ||= {}
      options[:html][:autocomplete] ||= "off"
    end

    def fields_for_with_beyond(record_name, record_object=nil, fields_options={}, &block)
      fields_options = fields_for_options(record_object, fields_options)
      record_object.is_a?(Hash) && record_object.extractable_options? &&
        record_object = nil
      fields_for_without_beyond(record_name, record_object, fields_options, &block)
    end

    beyond_alias :fields_for

    # the Rails `fields` method passes its options
    # to the builder, so there is no need to write a `beyond_form` helper
    # for the `fields` method.

    private

    def fields_for_options(record_object, fields_options)
      field_options = fields_options
      record_object.is_a?(Hash) && record_object.extractable_options? &&
        field_options = record_object
      %i[layout control_col inline_errors label_errors].each do |option|
        field_options[option] ||= options[option]
      end
      field_options[:label_col] = field_options[:label_col].present? ? (field_options[:label_col]).to_s : options[:label_col]
      field_options
    end

    def default_layout
      # :default, :horizontal or :inline
      :default
    end

    def default_label_col
      "col-sm-2"
    end

    def offset_col(label_col)
      label_col.gsub(/\bcol-(\w+)-(\d)\b/, 'offset-\1-\2')
    end

    def default_control_col
      "col-sm-10"
    end

    def hide_class
      "sr-only" # still accessible for screen readers
    end

    def control_class
      "form-control"
    end

    def feedback_class
      "has-feedback"
    end

    def control_specific_class(method)
      "rails-beyond-forms-#{method.to_s.tr('_', '-')}"
    end
  end
end
