# frozen_string_literal: true

module BeyondForm
  module Inputs
    module NumberField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :number_field
      end
    end
  end
end
