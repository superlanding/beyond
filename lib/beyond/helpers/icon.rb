module Beyond
  module Helpers
    module Icon
      def b_icon(i, *args)
        if args.is_a?(Hash)
          text = nil
          options = args
        elsif args.is_a?(Array)
          text = args.shift
          options = args.shift || {}
        else
          text = nil
          options = {}
        end

        klass = options.delete(:class) { nil }
        tag = content_tag(:i, "", options.merge(class: "icon icon-#{i} #{klass}"))
        text ? [tag, text].join(" ").html_safe : tag
      end
    end
  end
end
