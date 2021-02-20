#!/usr/bin/env node

const _ = require('lodash')
const CloudFormation = require('aws-sdk/clients/cloudformation')
const S3 = require('aws-sdk/clients/s3')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

require('dotenv').config({ path: '.env.production' })

const s3 = new S3({ region: process.env.AWS_REGION })
const cloudFormation = new CloudFormation({ region: process.env.AWS_REGION })
const videoAssetBucket = process.env.VIDEO_ASSET_BUCKET

async function stackName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  const branchName = stdout.substring(0, stdout.length - 1)

  return branchName === 'master' ? 'inside-story' : branchName
}

async function getCorsRules () {
  return s3.getBucketCors({ Bucket: videoAssetBucket }).promise()
}

async function putCorsRules (rules) {
  return s3.putBucketCors({ Bucket: videoAssetBucket, CORSConfiguration: rules }).promise()
}

function hasRule (rules) {
  return rules.CORSRules.find((rule) =>
    rule.AllowedOrigins.includes(`https://${process.env.CLOUDFRONT_DOMAIN}`))
}

async function removeCORSRule () {
  const corsRules = await getCorsRules()
  if (!hasRule(corsRules)) {
    console.log('CORS rule does not exist; skipping')
  } else {
    console.log(`Removing CORS rule for ${process.env.CLOUDFRONT_DOMAIN}`)
    const newRules = {
      CORSRules: corsRules.CORSRules.filter(rule =>
        !rule.AllowedOrigins.includes(`https://${process.env.CLOUDFRONT_DOMAIN}`))
    }
    await putCorsRules(newRules)
  }
}

async function listObjects (ContinuationToken = null) {
  const params = {
    Bucket: process.env.SITE_BUCKET,
    MaxKeys: 1000,
    ContinuationToken
  }

  let data
  try {
    data = await s3.listObjectsV2(params).promise()
  } catch (e) {
    console.log(`Error retrieving data with ContinuationToken ${ContinuationToken}`)
    throw e
  }

  const contents = data.Contents.map(content => content.Key)
  if (!data.IsTruncated) {
    return contents
  }

  return contents.concat(await listObjects(data.NextContinuationToken))
}

async function destroyObjects (allObjects) {
  _.chunk(allObjects, 1000).forEach(async objects => {
    await s3.deleteObjects({
      Bucket: process.env.SITE_BUCKET,
      Delete: {
        Objects: objects.map(object => ({ Key: object }))
      }
    }).promise()
  })
}

async function destroyStack () {
  return cloudFormation.deleteStack({
    StackName: await stackName()
  }).promise()
}

(async () => {
  try {
    const stack = await stackName()
    if (stack === 'inside-story') {
      console.log('Stack is inside-story; Aborting.')
      return
    }

    console.log('Removing CORS rule')
    await removeCORSRule()

    console.log('Destroying S3 objects')
    const objects = await listObjects()
    await destroyObjects(objects)

    console.log('Destroying CloudFormation stack')
    await destroyStack()
  } catch (err) {
    console.log(err)
  }
})()
