# frozen_string_literal: true

module BeyondForm
  module Inputs
    module PasswordField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :password_field
      end
    end
  end
end
