# frozen_string_literal: true

module BeyondForm
  module Inputs
    module CollectionCheckBoxes
      extend ActiveSupport::Concern
      include Base
      include InputsCollection

      included do
        def collection_check_boxes_with_beyond(*args)
          html = inputs_collection(*args) do |name, value, options|
            options[:multiple] = true
            check_box(name, options, value, nil)
          end
          hidden_field(args.first, value: "", multiple: true).concat(html)
        end

        beyond_alias :collection_check_boxes
      end
    end
  end
end
