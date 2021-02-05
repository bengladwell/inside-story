#!/usr/bin/env node

const CloudFormation = require('aws-sdk/clients/cloudformation')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const readFile = promisify(require('fs').readFile)

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const cloudFormation = new CloudFormation({ region: process.env.AWS_REGION })

async function branchName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  return stdout.substring(0, stdout.length - 1)
}

async function createStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    return await cloudFormation.createStack({
      StackName: await branchName(),
      TemplateBody: cfTemplate,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters: [{
        ParameterKey: 'FacebookAppId',
        ParameterValue: process.env.FACEBOOK_APP_ID
      }, {
        ParameterKey: 'FacebookAppSecret',
        ParameterValue: process.env.FACEBOOK_APP_SECRET
      }, {
        ParameterKey: 'VideoAssetArn',
        ParameterValue: process.env.VIDEO_ASSET_ARN
      }]
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
