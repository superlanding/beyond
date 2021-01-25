# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TextField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :text_field
      end
    end
  end
end
