# frozen_string_literal: true

module BeyondForm
  module Inputs
    module DateField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :date_field
      end
    end
  end
end
