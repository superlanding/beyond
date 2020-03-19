module Beyond
  module Rails
    class Engine < ::Rails::Engine
      initializer 'beyond.assets.precompile' do |app|

        %w(sass).each do |sub|
          app.config.assets.paths << root.join('src', sub).to_s
        end

        %w(js font img).each do |sub|
          app.config.assets.paths << root.join('dist', sub).to_s
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
