# frozen_string_literal: true

module BeyondForm
  module Inputs
    module SearchField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :search_field
      end
    end
  end
end
