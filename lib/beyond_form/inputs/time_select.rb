# frozen_string_literal: true

module BeyondForm
  module Inputs
    module TimeSelect
      extend ActiveSupport::Concern
      include Base

      included do
        beyond_select_group :time_select
      end
    end
  end
end
