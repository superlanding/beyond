module Beyond
  module Helpers
    module Attr
      def b_attr
        return {
          'data-controller': controller_name,
          'data-action': action_name
        }
      end
    end
  end
end
