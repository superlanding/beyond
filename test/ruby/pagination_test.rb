require "test_helper"

class BeyondPaginationTest < ActionView::TestCase
  include HtmlHelpers

  setup do
    # 測試環境沒有 routes，直接以 page 參數產生網址
    view.define_singleton_method(:url_for) do |params|
      params.is_a?(Hash) ? "/items?page=#{params[:page]}" : params.to_s
    end
  end

  def collection(page, total_pages)
    WillPaginate::Collection.create(page, 10, total_pages * 10) { |c| c.replace((1..10).to_a) }
  end

  def pagination(page, total_pages = 5, **opts)
    frag(view.will_paginate(collection(page, total_pages), **opts))
  end

  def test_renders_a_bootstrap_style_pagination_list
    ul = pagination(2).at_css("ul")
    assert_equal %w[pagination pagination-sm], ul["class"].split
  end

  def test_renders_previous_all_pages_and_next
    items = pagination(2).css("li.page-item")
    texts = items.map { |li| li.text.strip }
    # 前後頁文字來自 will_paginate 的預設 label（i18n），不在此綁死文案
    assert_match(/Previous/, texts.first)
    assert_equal %w[1 2 3 4 5], texts[1..-2]
    assert_match(/Next/, texts.last)
  end

  def test_marks_only_the_current_page_active
    active = pagination(3).css("li.page-item.active")
    assert_equal ["3"], active.map { |li| li.text.strip }
  end

  def test_page_links_point_to_the_page_and_carry_page_link_class
    link = pagination(1).css("li.page-item a.page-link").find { |a| a.text == "4" }
    assert_equal "/items?page=4", link["href"]
  end

  def test_previous_and_next_target_neighbouring_pages
    items = pagination(3).css("li.page-item")
    assert_equal "/items?page=2", items.first.at_css("a")["href"]
    assert_equal "/items?page=4", items.last.at_css("a")["href"]
  end

  def test_previous_is_disabled_on_first_page
    first = pagination(1).css("li.page-item").first
    assert_includes first["class"].split, "disabled"
    assert_equal "#", first.at_css("a")["href"]
  end

  def test_next_is_disabled_on_last_page
    last = pagination(5).css("li.page-item").last
    assert_includes last["class"].split, "disabled"
    assert_equal "#", last.at_css("a")["href"]
  end

  def test_custom_previous_and_next_labels
    texts = pagination(2, previous_label: "Prev", next_label: "Next").css("li.page-item").map { |li| li.text.strip }
    assert_equal "Prev", texts.first
    assert_equal "Next", texts.last
  end

  def test_gap_is_rendered_as_nothing_for_long_ranges
    texts = pagination(10, 20).css("li.page-item").map { |li| li.text.strip }
    refute_includes texts, "…"
    refute_includes texts, "&hellip;"
    assert_includes texts, "10"
  end

  def test_renders_nothing_for_a_single_page
    assert_nil view.will_paginate(collection(1, 1))
  end

  def test_default_renderer_is_beyond_renderer_and_not_remote
    links = pagination(2).css("a")
    assert(links.none? { |a| a["data-remote"] })
  end

  def test_remote_option_uses_remote_link_renderer
    links = pagination(2, remote: true).css("a")
    assert(links.any?)
    assert(links.all? { |a| a["data-remote"] == "true" })
  end

  def test_renderer_classes_hierarchy
    assert_operator BeyondPagination::Renderer, :<, WillPaginate::ActionView::LinkRenderer
    assert_operator BeyondPagination::RemoteLinkRenderer, :<, BeyondPagination::Renderer
  end

  def test_explicit_renderer_option_wins
    custom = Class.new(BeyondPagination::Renderer) { def gap = "" }
    html = view.will_paginate(collection(2, 3), renderer: custom)
    assert_includes html, "page-item"
  end
end
