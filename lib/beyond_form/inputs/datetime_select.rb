# frozen_string_literal: true

module BeyondForm
  module Inputs
    module DatetimeSelect
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_select_group :datetime_select
      end
    end
  end
end
