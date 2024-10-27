require 'dotenv'
require 'uri'

Dotenv.load

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['site_domain'] = ENV.fetch('JEKYLL_ENV', 'development') == 'production' ? ENV['SITE_DOMAIN'] : 'local.bengladwell.com'
      site.config['encoded_redirect_uri'] = URI.encode_www_form_component('https://' + site.config['site_domain'] + '/')
      site.config['video_domain'] = ENV['VIDEO_DOMAIN']
      site.config['signer_domain'] = ENV['SIGNER_DOMAIN']
      site.config['signer_path'] = ENV['SIGNER_PATH']
      site.config['user_pool_name'] = ENV['USER_POOL_NAME']
      site.config['user_pool_client_id'] = ENV['USER_POOL_CLIENT_ID']
    end

  end

end
