# frozen_string_literal: true

module BeyondForm
  module Inputs
    module WeekField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :week_field
      end
    end
  end
end
