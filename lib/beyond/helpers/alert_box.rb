module Beyond
  module Helpers
    module AlertBox

      def alertbox(*args, &block)
        if block_given?
          html = yield
        else
          html = args.shift
        end
        options = args.shift
        style = options.delete(:style) { :primary }
        css = options.delete(:class) { "" }
        dismissible = options.delete(:dismissible) { false }

        opts = options.merge(class: "alert alert-#{style} #{css}", role: "alert")
        content_tag(:div, opts) do
          concat(html)
          concat(alertbox_dismiss_button) if dismissible
        end
      end

      protected

      def alertbox_dismiss_button
        %{
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        }.html_safe
      end
    end
  end
end
