# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TextArea
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :text_area
      end
    end
  end
end
