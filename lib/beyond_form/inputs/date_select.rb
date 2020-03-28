# frozen_string_literal: true

module BeyondForm
  module Inputs
    module DateSelect
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_select_group :date_select
      end
    end
  end
end
