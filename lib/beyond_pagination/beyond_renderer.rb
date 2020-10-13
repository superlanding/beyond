module BeyondPagination
  module BeyondRenderer
    def to_html
      list_items = pagination.map do |item|
        case item
        when Fixnum
          page_number(item)
        else
          send(item)
        end
      end.join(@options[:link_separator])

      tag("ul", list_items, class: "pagination pagination-sm")
    end

    def container_attributes
      { class: "pagination" }
    end

    def page_number(page)
      tag(:li, link(page, page, class: 'page-link', rel: rel_value(page)), class: "page-item #{page == current_page ? 'active' : '' }")
    end

    def gap
      ""
    end

    def previous_page
      num = @collection.current_page > 1 && @collection.current_page - 1
      previous_or_next_page(num, @options[:previous_label] || "&lsaquo;")
    end

    def next_page
      num = @collection.current_page < total_pages && @collection.current_page + 1
      previous_or_next_page(num, @options[:next_label] || "&rsaquo;")
    end

    def previous_or_next_page(page, text)
      if page
        tag(:li, link(text, page, class: 'page-link', rel: rel_value(page)), class: "page-item")
      else
        tag(:li, link(text, "#", class: 'page-link', rel: rel_value(page)), class: "page-item disabled")
      end
    end
  end
end
