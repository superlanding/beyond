# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TimeField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :time_field
      end
    end
  end
end
