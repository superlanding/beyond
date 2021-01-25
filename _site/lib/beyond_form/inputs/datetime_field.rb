# frozen_string_literal: true

module BeyondForm
  module Inputs
    module DatetimeField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :datetime_field
      end
    end
  end
end
