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

async function createStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    const StackName = await stackName()
    const Parameters = [{
      ParameterKey: 'FacebookAppId',
      ParameterValue: process.env.FACEBOOK_APP_ID
    }, {
      ParameterKey: 'FacebookAppSecret',
      ParameterValue: process.env.FACEBOOK_APP_SECRET
    }, {
      ParameterKey: 'VideoAssetArn',
      ParameterValue: process.env.VIDEO_ASSET_ARN
    }, {
      ParameterKey: 'AccessAdminEmail',
      ParameterValue: process.env.ACCESS_ADMIN_EMAIL
    }, {
      ParameterKey: 'AccessSourceEmail',
      ParameterValue: process.env.ACCESS_SOURCE_EMAIL
    }]

    if (StackName === 'inside-story') {
      Parameters.push({
        ParameterKey: 'HostedZoneId',
        ParameterValue: process.env.HOSTED_ZONE_ID
      }, {
        ParameterKey: 'FullyQualifiedHostName',
        ParameterValue: process.env.FULLY_QUALIFIED_HOST_NAME
      })
    }

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
