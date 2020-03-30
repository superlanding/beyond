# frozen_string_literal: true

module BeyondForm
  module Inputs
    module CollectionRadioButtons
      extend ActiveSupport::Concern
      include Base
      include InputsCollection

      included do
        def collection_radio_buttons_with_beyond(*args)
          inputs_collection(*args) do |name, value, options|
            radio_button(name, value, options)
          end
        end

        beyond_alias :collection_radio_buttons
      end
    end
  end
end
