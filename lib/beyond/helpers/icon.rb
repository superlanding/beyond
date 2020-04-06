module Beyond
  module Helpers
    module Icon
      def b_icon(i, *args)
        text = nil
        options = {}

        if args.length == 1
          if args[0].is_a?(String)
            text = args.shift
          else
            options = args.shift
          end
        elsif args.length == 2
          text = args.shift
          options = args.shift
        end

        klass = options.delete(:class) { nil }
        tag = content_tag(:i, "", options.merge(class: "icon icon-#{i} #{klass}"))
        text ? [tag, text].join(" ").html_safe : tag
      end
    end
  end
end
