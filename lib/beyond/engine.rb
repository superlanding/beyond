module Beyond
  module Rails
    class Engine < ::Rails::Engine
      config.eager_load_namespaces << Beyond
      config.autoload_paths << File.expand_path("lib", __dir__)

      initializer 'beyond.assets.precompile' do |app|

        app.config.assets.paths << root.join('src', 'sass').to_s
        app.config.assets.paths << root.join('dist').to_s

        %w(font img).each do |folder|
          app.config.assets.paths << root.join('src', folder).to_s
        end

        # sprockets-rails 3 tracks down the calls to `font_path` and `image_path`
        # and automatically precompiles the referenced assets.
        unless Sprockets::Rails::VERSION.split('.', 2)[0].to_i >= 3
          app.config.assets.precompile << %r(icomoon\.(?:eot|svg|ttf|woff2?)$)
        end
      end
    end
  end
end
