# frozen_string_literal: true

module BeyondForm
  module Inputs
    module UrlField
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_field :url_field
      end
    end
  end
end
