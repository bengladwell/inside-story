#!/usr/bin/env node

const CloudFormation = require('aws-sdk/clients/cloudformation')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const readFile = promisify(require('fs').readFile)

require('dotenv').config()

const cloudFormation = new CloudFormation({ region: process.env.AWS_REGION })

async function stackName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  const branchName = stdout.substring(0, stdout.length - 1)

  return branchName === 'master' ? 'inside-story' : branchName
}

async function genPrivateKey () {
  const { stdout, stderr } = await exec('openssl genrsa 2048')
  if (stderr && !stderr.match(/^Generating RSA private key, 2048 bit long modulus/)) {
    throw new Error(stderr)
  }

  return stdout.substring(0, stdout.length - 1)
}

async function genPublicKey (privateKey) {
  const { stdout, stderr } = await exec(`echo "${privateKey}" | openssl rsa -pubout`)
  if (stderr && !stderr.match(/^writing RSA key/)) {
    throw new Error(stderr)
  }

  return stdout.substring(0, stdout.length - 1)
}

async function createStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    const StackName = await stackName()
    const privateKey = await genPrivateKey()
    const uriEncodedPrivateKey = encodeURI(privateKey)
    const publicKey = await genPublicKey(privateKey)
    const Parameters = [{
      ParameterKey: 'FacebookAppId',
      ParameterValue: process.env.FACEBOOK_APP_ID
    }, {
      ParameterKey: 'FacebookAppSecret',
      ParameterValue: process.env.FACEBOOK_APP_SECRET
    }, {
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

    return await cloudFormation.createStack({
      StackName,
      TemplateBody: cfTemplate,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters
    }).promise()
  } catch (err) {
    console.log('Error creating stack')
    throw err
  }
}

(async () => {
  try {
    console.log(await createStack())
  } catch (err) {
    console.log(err)
  }
})()
