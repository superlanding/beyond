require "beyond/version"
require "beyond_form"
module Beyond

  class << self

    def load!
      if rails?
        register_rails_engine
        require "beyond/helpers"
      elsif sprockets?
        register_sprockets
      end
    end

    def gem_path
      @gem_path ||= File.expand_path '..', File.dirname(__FILE__)
    end

    def assets_path
      @assets_path ||= File.join gem_path, 'src'
    end

    def dist_path
      @dist_path ||= File.join gem_path, 'dist'
    end

    def stylesheets_path
      File.join assets_path, 'sass'
    end

    def font_path
      File.join dist_path, 'font'
    end

    def javascripts_path
      File.join dist_path, 'js'
    end

    def rails?
      defined?(::Rails)
    end

    def sprockets?
      defined?(::Sprockets)
    end

    private

    def register_rails_engine
      require 'beyond/engine'
    end

    def register_sprockets
      Sprockets.append_path(stylesheets_path)
      Sprockets.append_path(font_path)
      Sprockets.append_path(javascripts_path)
    end
  end
end

Beyond.load!
