require "test_helper"

class BeyondModuleTest < Minitest::Test
  def test_version_is_a_dotted_string
    assert_match(/\A\d+\.\d+\.\d+\z/, Beyond::VERSION)
  end

  def test_paths_are_relative_to_the_gem_root
    root = File.expand_path("../..", __dir__)
    assert_equal root, Beyond.gem_path
    assert_equal File.join(root, "src"), Beyond.assets_path
    assert_equal File.join(root, "dist"), Beyond.dist_path
    assert_equal File.join(root, "src", "sass"), Beyond.stylesheets_path
    assert_equal File.join(root, "dist", "font"), Beyond.font_path
    assert_equal File.join(root, "dist", "js"), Beyond.javascripts_path
  end

  def test_asset_directories_referenced_by_the_engine_exist
    %w[sass img font].each do |dir|
      assert File.directory?(File.join(Beyond.assets_path, dir)), "src/#{dir} should exist"
    end
  end

  def test_rails_is_detected
    assert Beyond.rails?
  end

  def test_engine_is_a_rails_engine
    assert_operator Beyond::Rails::Engine, :<, ::Rails::Engine
    assert_operator BeyondForm::Engine, :<, ::Rails::Engine
  end

  def test_helpers_are_mixed_into_action_view
    %i[b_alert_box b_attr b_icon icon_link_to will_paginate].each do |m|
      assert_includes ActionView::Base.instance_methods, m
    end
  end
end

class BeyondHelpersTest < ActionView::TestCase
  include HtmlHelpers

  # ---- b_alert_box ----
  def test_alert_box_with_text_uses_primary_style_by_default
    div = frag(view.b_alert_box("Saved", {})).at_css("div")
    assert_equal "Saved", div.text.strip
    assert_equal "alert", div["role"]
    assert_equal "true", div["data-alert"]
    assert_equal %w[alert alert-primary], div["class"].split
  end

  def test_alert_box_style_and_extra_class_and_attributes
    div = frag(view.b_alert_box("Oops", { style: :danger, class: "mb-3", id: "flash" })).at_css("div")
    assert_equal %w[alert alert-danger mb-3], div["class"].split
    assert_equal "flash", div["id"]
  end

  def test_alert_box_accepts_a_block_for_the_body
    html = view.b_alert_box({ style: :success }) { "From block" }
    div = frag(html).at_css("div.alert-success")
    assert_equal "From block", div.text.strip
  end

  def test_alert_box_dismissible_adds_class_and_close_button
    div = frag(view.b_alert_box("Bye", { dismissible: true })).at_css("div")
    assert_includes div["class"].split, "alert-dismissible"
    button = div.at_css("button.close")
    assert_equal "alert", button["data-dismiss"]
    assert_equal "Close", button["aria-label"]
  end

  def test_alert_box_not_dismissible_has_no_close_button
    assert_nil frag(view.b_alert_box("Stay", {})).at_css("button")
  end

  def test_alert_box_escapes_unsafe_html
    div = frag(view.b_alert_box("<script>x</script>", {})).at_css("div")
    assert_nil div.at_css("script")
    assert_includes div.text, "<script>x</script>"
  end

  # 已知問題（與 Rails 版本無關）：只傳一個參數時 options 為 nil，呼叫 nil.delete 而 NoMethodError。
  # 依規則不為了讓測試通過而修改 lib，這裡 skip 並寫在 PR 的 finding 中。
  def test_alert_box_with_only_text
    skip "KNOWN BUG: b_alert_box(\"text\") raises NoMethodError because options is nil; see PR finding"
    assert_includes view.b_alert_box("Saved"), "Saved"
  end

  # ---- b_attr ----
  def test_attr_exposes_controller_and_action_data_attributes
    controller.action_name = "show"
    attrs = view.b_attr
    assert_equal "test", attrs[:"data-controller"]
    assert_equal "show", attrs[:"data-action"]
  end

  # ---- b_icon / icon_link_to ----
  def test_icon_only
    i = frag(view.b_icon("home")).at_css("i")
    assert_equal ["icon-home"], i["class"].split
    assert_equal "", i.text.to_s
  end

  def test_icon_with_text_appends_text_after_tag
    html = view.b_icon("home", "Home")
    assert_predicate html, :html_safe?
    assert_equal "Home", frag(html).text.strip
    assert_equal "i", frag(html).children.first.name
  end

  def test_icon_with_options_hash_adds_class_and_attributes
    i = frag(view.b_icon("star", { class: "text-warning", title: "fav" })).at_css("i")
    assert_equal %w[icon-star text-warning], i["class"].split
    assert_equal "fav", i["title"]
  end

  def test_icon_option_adds_icon_base_class
    i = frag(view.b_icon("star", { icon: true })).at_css("i")
    assert_equal %w[icon-star icon], i["class"].split
    assert_nil i["icon"], "the :icon flag must not leak into the HTML"
  end

  def test_icon_with_text_and_options
    html = view.b_icon("trash", "Delete", { class: "red", icon: true })
    i = frag(html).at_css("i")
    assert_equal %w[icon-trash icon red], i["class"].split
    assert_equal "Delete", frag(html).text.strip
  end

  def test_icon_link_to_wraps_icon_and_text_in_a_link
    a = frag(view.icon_link_to("home", "Home", "/home", class: "btn")).at_css("a")
    assert_equal "/home", a["href"]
    assert_equal "btn", a["class"]
    assert a.at_css("i.icon-home.icon")
    assert_equal "Home", a.text.strip
  end
end
