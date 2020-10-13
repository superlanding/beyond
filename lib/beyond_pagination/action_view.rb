require "will_paginate/view_helpers/action_view"
require "beyond_pagination/beyond_renderer"

module BeyondPagination
  # A custom renderer class for WillPaginate that produces markup suitable for use with Twitter Bootstrap.
  class Renderer < WillPaginate::ActionView::LinkRenderer
    include BeyondPagination::BeyondRenderer
  end

  class RemoteLinkRenderer < Renderer
    def link(text, target, attr = {})
      attr['data-remote'] = true
      super
    end
  end
end
