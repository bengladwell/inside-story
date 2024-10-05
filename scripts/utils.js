const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

async function stackName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  const branchName = stdout.substring(0, stdout.length - 1)

  return branchName === 'main' ? 'inside-story' : branchName
}

async function genPublicKey (privateKey) {
  const { stdout, stderr } = await exec(`echo "${privateKey}" | openssl rsa -pubout`)
  if (stderr && !stderr.match(/^writing RSA key/)) {
    throw new Error(stderr)
  }

  return stdout.substring(0, stdout.length - 1)
}

async function getParams (uriEncodedPrivateKey, publicKey) {
  const StackName = await stackName()
  return [{
    ParameterKey: 'GoogleClientId',
    ParameterValue: process.env.GOOGLE_CLIENT_ID
  }, {
    ParameterKey: 'GoogleClientSecret',
    ParameterValue: process.env.GOOGLE_CLIENT_SECRET
  }, {
    ParameterKey: 'AccessAdminEmail',
    ParameterValue: process.env.ACCESS_ADMIN_EMAIL
  }, {
    ParameterKey: 'AccessSourceEmail',
    ParameterValue: process.env.ACCESS_SOURCE_EMAIL
  }, {
    ParameterKey: 'VideoAssetBucket',
    ParameterValue: process.env.VIDEO_ASSET_BUCKET
  }, {
    ParameterKey: 'VideoAssetPath',
    ParameterValue: process.env.VIDEO_ASSET_PATH
  }, {
    ParameterKey: 'VideoPrivateKeyUriEncoded',
    ParameterValue: uriEncodedPrivateKey
  }, {
    ParameterKey: 'VideoPublicKey',
    ParameterValue: publicKey
  }, {
    ParameterKey: 'HostedZoneId',
    ParameterValue: process.env.HOSTED_ZONE_ID
  }, {
    ParameterKey: 'SiteAssetDomain',
    ParameterValue: StackName === 'inside-story'
      ? `${process.env.SITE_ASSET_HOST_NAME}.${process.env.HOSTED_ZONE_DOMAIN}`
      : `${StackName}.${process.env.HOSTED_ZONE_DOMAIN}`
  }, {
    ParameterKey: 'VideoAssetDomain',
    ParameterValue: StackName === 'inside-story'
      ? `${process.env.SITE_ASSET_HOST_NAME}-videos.${process.env.HOSTED_ZONE_DOMAIN}`
      : `${StackName}-videos.${process.env.HOSTED_ZONE_DOMAIN}`
  }, {
    ParameterKey: 'SignerDomain',
    ParameterValue: StackName === 'inside-story'
      ? `${process.env.SITE_ASSET_HOST_NAME}-signer.${process.env.HOSTED_ZONE_DOMAIN}`
      : `${StackName}-signer.${process.env.HOSTED_ZONE_DOMAIN}`
  }, {
    ParameterKey: 'SignerPath',
    ParameterValue: process.env.SIGNER_PATH
  }, {
    ParameterKey: 'SignedCookieDomain',
    ParameterValue: process.env.HOSTED_ZONE_DOMAIN
  }]
}

module.exports = {
  stackName,
  genPublicKey,
  getParams,
}
