# frozen_string_literal: true

module BeyondForm
  module Inputs
    module RangeField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :range_field
      end
    end
  end
end
