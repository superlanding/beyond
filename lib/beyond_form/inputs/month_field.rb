# frozen_string_literal: true

module BeyondForm
  module Inputs
    module MonthField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :month_field
      end
    end
  end
end
