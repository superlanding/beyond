module BeyondForm
  module Translator

    SCOPE = [:activerecord, :attributes]

    # 讓 BeyondForm 的 form helper 支援 i18n, ex: f.select(..., label: :i18n_key_name)
    # override:
    #   color_field date_field datetime_field datetime_local_field email_field month_field
    #   number_field password_field phone_field range_field search_field telephone_field
    #   text_area text_field time_field url_field week_field
    #
    # https://github.com/bootstrap-ruby/bootstrap_form/blob/v2.6.0/lib/bootstrap_form/form_builder.rb
    BeyondForm::FormBuilder::FIELD_HELPERS.each do |method_name|
      define_method(method_name) do |name, options = {}|
        label = options[:label]

        if label && is_i18n_key?(label)
          options[:label] = i18n_t("#{object_name}.#{label}", options[:locale])
        end

        super(name, options)
      end
    end

    # override: f.select
    define_method(:select) do |name, collection, options={}, html_options={}|
      label = options[:label]

      if label && is_i18n_key?(label)
        options[:label] = i18n_t("#{object_name}.#{label}", options[:locale])
      elsif label.nil? && !options[:hide_label]
        options[:label] = i18n_t("#{object_name}.#{name}", options[:locale])
      end

      super(name, collection, options, html_options)
    end

    protected

    def is_i18n_key?(key)
      key.is_a?(Symbol)
    end

    def i18n_t(key, locale)
      options = { scope: SCOPE }
      if locale.present?
        options.merge!(locale: locale || I18n.default_locale)
      end
      I18n.t(key, options)
    end
  end
end

BeyondForm::FormBuilder.send(:prepend, BeyondForm::Translator)