# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TelephoneField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :telephone_field
      end
    end
  end
end
