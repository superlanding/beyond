module Beyond
  module Helpers
    module Icon
      def b_icon(i, text=nil)
        tag = content_tag(:span, content_tag(:i, "", class: "icon-#{i}"), class: "icon")
        text ? [tag, text].join(" ").html_safe : tag
      end
    end
  end
end
