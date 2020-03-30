# frozen_string_literal: true

module BeyondForm
  module Inputs
    module PhoneField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :phone_field
      end
    end
  end
end
