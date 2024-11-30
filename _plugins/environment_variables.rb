require 'dotenv'
require 'uri'

Dotenv.load

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      # TODO: less about JEKYLL_ENV, more about if we are building or serving
      site.config['site_domain'] = ENV.fetch('JEKYLL_ENV', 'development') == 'production' ? ENV['SITE_DOMAIN'] : 'local.bengladwell.com'
      # site.config['encoded_redirect_uri'] = URI.encode_www_form_component('https://' + site.config['site_domain'] + '/')
      # site.config['encoded_redirect_uri'] = URI.encode_www_form_component('https://qhgjglbqjj.execute-api.us-east-1.amazonaws.com/default/jekyll-inside-story_Authorizer')
      site.config['encoded_redirect_uri'] = URI.encode_www_form_component('https://local.bengladwell.com/')
      site.config['video_domain'] = ENV['VIDEO_DOMAIN']
      site.config['auth_domain'] = ENV['AUTH_DOMAIN']
      site.config['login_path'] = ENV['LOGIN_PATH']
      site.config['user_pool_name'] = ENV['USER_POOL_NAME']
      site.config['user_pool_client_id'] = ENV['USER_POOL_CLIENT_ID']
    end

  end

end
