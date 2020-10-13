module Beyond
  module Helpers
    module WillPaginate
      def will_paginate(collection, opts={})
        renderer = if opts.delete(:remote)
          BeyondPagination::RemoteLinkRenderer
        else
          BeyondPagination::Renderer
        end
        super(collection, { renderer: renderer }.merge(opts))
      end
    end
  end
end
