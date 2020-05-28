/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react')
const { stripIndent } = require('common-tags')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

exports.onRenderBody = ({ setPreBodyComponents }, pluginOptions) => {
  return setPreBodyComponents([
    (<script
      key='facebook-sdk-init'
      dangerouslySetInnerHTML={{
        __html: stripIndent`
        window.fbAsyncInit = function() {
          FB.init({
            appId            : '${process.env.FACEBOOK_APP_ID}',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v7.0'
          });
        };
        `
      }}
    />),
    (<script key='facebook-sdk' async={true} defer={true} src='https://connect.facebook.net/en_US/sdk.js' />)
  ])
}
