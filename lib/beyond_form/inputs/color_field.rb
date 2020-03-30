# frozen_string_literal: true

module BeyondForm
  module Inputs
    module ColorField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :color_field
      end
    end
  end
end
