require "test_helper"

class BeyondFormTest < ActionView::TestCase
  include HtmlHelpers

  def user
    @user ||= User.new(name: "Bob", email: "bob@example.com", role: "member")
  end

  def form(options = {}, &block)
    block ||= proc { |f| f.text_field(:name) }
    frag(view.beyond_form_for(user, { as: :user, url: "/users" }.merge(options), &block))
  end

  # ---- form wrappers ----
  def test_form_for_uses_beyond_builder
    builder = nil
    view.beyond_form_for(user, as: :user, url: "/users") { |f| builder = f; "" }
    assert_kind_of BeyondForm::FormBuilder, builder
  end

  def test_form_for_sets_role_form_and_autocomplete_off
    f = form.at_css("form")
    assert_equal "form", f["role"]
    assert_equal "off", f["autocomplete"]
    assert_equal "/users", f["action"]
  end

  def test_form_for_respects_explicit_html_options
    f = form(html: { role: "search", autocomplete: "on", class: "x" }).at_css("form")
    assert_equal "search", f["role"]
    assert_equal "on", f["autocomplete"]
    assert_equal "x", f["class"]
  end

  def test_inline_layout_adds_form_inline_class
    assert_includes form(layout: :inline).at_css("form")["class"].split, "form-inline"
  end

  def test_form_with_uses_beyond_builder
    builder = nil
    html = view.beyond_form_with(model: user, scope: :user, url: "/users") { |f| builder = f; f.text_field(:name) }
    assert_kind_of BeyondForm::FormBuilder, builder
    assert_equal "form", frag(html).at_css("form")["role"]
    assert frag(html).at_css("div.form-group input.form-control")
  end

  def test_form_tag_acts_like_form_tag
    flag = nil
    view.beyond_form_tag(url: "/search") { |f| flag = f.acts_like_form_tag; "" }
    assert_equal true, flag
  end

  def test_field_error_proc_is_swapped_during_the_form_and_restored_after
    original = ActionView::Base.field_error_proc
    inside = nil
    view.beyond_form_for(user, as: :user, url: "/users") { |_f| inside = ActionView::Base.field_error_proc; "" }
    assert_same BeyondForm.field_error_proc, inside
    assert_same original, ActionView::Base.field_error_proc
  end

  def test_field_error_proc_is_restored_when_the_block_raises
    original = ActionView::Base.field_error_proc
    assert_raises(RuntimeError) do
      view.beyond_form_for(user, as: :user, url: "/users") { |_f| raise "boom" }
    end
    assert_same original, ActionView::Base.field_error_proc
  end

  def test_default_field_error_proc_leaves_html_untouched
    assert_equal "<input>", BeyondForm.field_error_proc.call("<input>", nil)
  end

  # ---- form groups ----
  def test_text_field_is_wrapped_in_form_group_with_label
    doc = form
    group = doc.at_css("div.form-group")
    assert_equal "Name", group.at_css("label").text
    assert_equal "user_name", group.at_css("label")["for"]
    input = group.at_css("input.form-control")
    assert_equal "text", input["type"]
    assert_equal "Bob", input["value"]
    assert_equal "user[name]", input["name"]
  end

  def test_horizontal_layout_uses_grid_classes
    doc = form(layout: :horizontal)
    group = doc.at_css("div.form-group")
    assert_includes group["class"].split, "row"
    assert_includes group.at_css("label")["class"].split, "col-sm-2"
    assert_includes group.at_css("div.col-sm-10")["class"].split, "col-form-field"
  end

  def test_custom_label_and_control_columns
    doc = form(layout: :horizontal, label_col: "col-md-3", control_col: "col-md-9")
    assert doc.at_css("label.col-md-3")
    assert doc.at_css("div.col-md-9")
  end

  def test_label_text_can_be_overridden
    doc = form { |f| f.text_field(:name, label: "Your name") }
    assert_equal "Your name", doc.at_css("label").text
  end

  def test_help_text_is_rendered
    doc = form { |f| f.text_field(:name, help: "Shown on invoices") }
    assert_includes doc.text, "Shown on invoices"
  end

  def test_other_field_types
    doc = form do |f|
      f.email_field(:email) + f.password_field(:name) + f.text_area(:name) + f.number_field(:name)
    end
    assert doc.at_css("input[type=email].form-control")
    assert doc.at_css("input[type=password].form-control")
    assert doc.at_css("textarea.form-control")
    assert doc.at_css("input[type=number].form-control")
  end

  def test_select_renders_options_and_form_control
    doc = form { |f| f.select(:role, [%w[Admin admin], %w[Member member]]) }
    select = doc.at_css("select.form-control")
    assert_equal %w[Admin Member], select.css("option").map(&:text)
    assert_equal "member", select.at_css("option[selected]")["value"]
  end

  def test_check_box_renders
    doc = form { |f| f.check_box(:admin, label: "Admin?") }
    assert doc.at_css("input[type=checkbox]")
    assert_includes doc.text, "Admin?"
  end

  # ---- validation errors ----
  def test_field_with_errors_shows_message
    user.errors.add(:name, "can't be blank")
    doc = form
    assert_includes doc.text, "can't be blank"
  end

  def test_field_without_errors_shows_no_error_markup
    refute_includes form.text, "blank"
    assert_nil form.at_css(".alert-danger")
  end

  def test_errors_on_returns_nil_without_errors_and_message_with_errors
    builder_result = []
    form { |f| builder_result << f.errors_on(:name); "" }
    assert_equal [nil], builder_result

    user.errors.add(:name, "is too short")
    form { |f| builder_result << f.errors_on(:name); "" }
    div = frag(builder_result.last).at_css("div.alert.alert-danger")
    assert_equal "Name is too short", div.text
  end

  def test_errors_on_can_hide_the_attribute_name
    user.errors.add(:name, "is too short")
    out = nil
    form { |f| out = f.errors_on(:name, hide_attribute_name: true); "" }
    assert_equal "is too short", frag(out).at_css("div.alert-danger").text
  end

  def test_alert_message_lists_all_errors
    user.errors.add(:name, "is too short")
    user.errors.add(:email, "is invalid")
    out = nil
    form { |f| out = f.alert_message("Please fix:"); "" }
    div = frag(out).at_css("div.alert.alert-danger")
    assert_equal "Please fix:", div.at_css("p").text
    assert_equal ["Name is too short", "Email is invalid"], div.css("ul.rails-beyond-forms-error-summary li").map(&:text)
  end

  def test_alert_message_is_nil_without_errors
    out = :unset
    form { |f| out = f.alert_message("Please fix:"); "" }
    assert_nil out
  end

  def test_alert_message_can_skip_summary_and_set_class
    user.errors.add(:name, "is too short")
    out = nil
    form { |f| out = f.alert_message("Oops", class: "alert alert-warning", error_summary: false); "" }
    div = frag(out).at_css("div.alert-warning")
    assert_nil div.at_css("ul")
  end

  # ---- buttons ----
  def test_submit_and_button_default_to_secondary
    doc = form { |f| f.submit("Go") + f.button("Click") }
    assert_equal "btn btn-secondary", doc.at_css("input[type=submit]")["class"]
    assert_equal "btn btn-secondary", doc.at_css("button")["class"]
  end

  def test_primary_renders_a_primary_submit
    doc = form { |f| f.primary("Save") }
    submit = doc.at_css("input[type=submit]")
    assert_equal "btn btn-primary", submit["class"]
    assert_equal "Save", submit["value"]
  end

  def test_primary_can_render_as_button
    doc = form { |f| f.primary("Save", render_as_button: true) }
    button = doc.at_css("button")
    assert_equal "btn btn-primary", button["class"]
    assert_nil button["render_as_button"]
  end

  def test_explicit_class_is_not_overridden_on_buttons
    doc = form { |f| f.submit("Go", class: "btn btn-danger") }
    assert_equal "btn btn-danger", doc.at_css("input[type=submit]")["class"]
  end

  def test_extra_class_is_appended_to_button_class
    doc = form { |f| f.submit("Go", extra_class: "w-100") }
    assert_equal "btn btn-secondary w-100", doc.at_css("input[type=submit]")["class"]
  end

  # ---- static / custom controls ----
  def test_static_control_is_readonly_plaintext
    doc = form { |f| f.static_control(:name) }
    input = doc.at_css("input[readonly]")
    assert_equal "Bob", input["value"]
    assert input.key?("readonly")
    assert_includes input["class"].split, "form-control-plaintext"
  end

  def test_custom_control_wraps_arbitrary_content_in_form_group
    doc = form { |f| f.custom_control(:name, label: "Custom") { "<b>hi</b>".html_safe } }
    group = doc.at_css("div.form-group")
    assert_equal "Custom", group.at_css("label").text
    assert_equal "hi", group.at_css("b").text
  end

  # ---- i18n labels (Translator) ----
  # 已知問題（與 Rails 版本無關）：lib/beyond_form/translator.rb 從未被 require，且引用的
  # BeyondForm::FormBuilder::FIELD_HELPERS 並不存在，所以 `label: :i18n_key` 目前不會被翻譯。
  # 依規則不在升級 PR 中改變 lib 行為，列在 PR finding。
  def test_symbol_label_is_translated
    skip "KNOWN BUG: BeyondForm::Translator is never loaded (and references an undefined FIELD_HELPERS); see PR finding"
  end
end
