# frozen_string_literal: true

module BeyondForm
  module Inputs
    module EmailField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :email_field
      end
    end
  end
end
