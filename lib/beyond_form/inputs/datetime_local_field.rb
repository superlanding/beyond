# frozen_string_literal: true

module BeyondForm
  module Inputs
    module DatetimeLocalField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :datetime_local_field
      end
    end
  end
end
