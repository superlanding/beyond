# frozen_string_literal: true

module BeyondForm
  module Components
    extend ActiveSupport::Autoload

    autoload :Hints
    autoload :Labels
    autoload :Layout
    autoload :Validation

    include Hints
    include Labels
    include Layout
    include Validation
  end
end
