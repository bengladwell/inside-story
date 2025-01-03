#!/usr/bin/env node

const _ = require('lodash')
const { CloudFormation } = require('@aws-sdk/client-cloudformation')
const { S3 } = require('@aws-sdk/client-s3')
const { promisify, inspect } = require('util')
const exec = promisify(require('child_process').exec)

require('dotenv').config({ path: '.env.production' })

const s3 = new S3({ region: process.env.AWS_REGION })
const cloudFormation = new CloudFormation({
  region: process.env.AWS_REGION
})
const videoAssetBucket = process.env.VIDEO_ASSET_BUCKET

async function stackName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  const branchName = stdout.substring(0, stdout.length - 1)

  return branchName === 'main' ? 'inside-story' : branchName
}

function putBucketPolicy (policy) {
  if (!policy.Statement.length) {
    return s3.deleteBucketPolicy({
      Bucket: videoAssetBucket
    })
  }
  return s3.putBucketPolicy({
    Bucket: videoAssetBucket,
    Policy: policy ? JSON.stringify(policy) : '{}'
  })
}

function hasRule (rules) {
  console.dir(rules, { depth: null })
  return rules.CORSRules.find((rule) =>
    rule.AllowedOrigins.includes(`https://${process.env.SITE_DOMAIN}`))
}

async function removeCORSRule () {
  const corsRules = await s3.getBucketCors({ Bucket: videoAssetBucket })
  if (!hasRule(corsRules)) {
    console.log('CORS rule does not exist; skipping')
  } else {
    console.log(`Removing CORS rule for ${process.env.SITE_DOMAIN}`)
    const newRules = {
      CORSRules: corsRules.CORSRules.filter(rule =>
        !rule.AllowedOrigins.includes(`https://${process.env.SITE_DOMAIN}`))
    }
    s3.putBucketCors({ Bucket: videoAssetBucket, CORSConfiguration: newRules })
  }
}

async function removeBucketPolicyStatement () {
  const stack = await stackName()
  const statement = {
    Sid: stack,
    Effect: 'Allow',
    Principal: {
      AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${process.env.VIDEO_ASSET_ORIGIN_ACCESS_IDENTITY}`
    },
    Action: 's3:GetObject',
    Resource: `arn:aws:s3:::${process.env.VIDEO_ASSET_BUCKET}${process.env.VIDEO_ASSET_PATH}/*`
  }
  const bucketPolicyString = await s3.getBucketPolicy({ Bucket: videoAssetBucket })
  const bucketPolicy = JSON.parse(bucketPolicyString.Policy)
  console.dir(bucketPolicy, { depth: null })

  if (!bucketPolicy.Statement.find(s => _.isEqual(s, statement))) {
    console.log('Policy statement does not exist; skipping')
  } else {
    console.log(`Removing policy statement for CloudFront Origin Access Identity ${process.env.VIDEO_ASSET_ORIGIN_ACCESS_IDENTITY}`)
    const newPolicy = {
      ...bucketPolicy,
      Statement: bucketPolicy.Statement.filter(s => !_.isEqual(s, statement))
    }
    await putBucketPolicy(newPolicy)
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
    data = await s3.listObjectsV2(params)
  } catch (e) {
    console.log(`Error retrieving data with ContinuationToken ${ContinuationToken}`)
    throw e
  }

  if (data.Contents) {
    const contents = data.Contents.map(content => content.Key)
    if (!data.IsTruncated) {
      return contents
    }

    return contents.concat(await listObjects(data.NextContinuationToken))
  }
}

async function destroyObjects (allObjects) {
  _.chunk(allObjects, 1000).forEach(async objects => {
    await s3.deleteObjects({
      Bucket: process.env.SITE_BUCKET,
      Delete: {
        Objects: objects.map(object => ({ Key: object }))
      }
    })
  })
}

async function destroyStack () {
  return cloudFormation.deleteStack({
    StackName: await stackName()
  });
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

    console.log('Removing video bucket policy statement')
    await removeBucketPolicyStatement()

    console.log('Destroying S3 objects')
    const objects = await listObjects()
    await destroyObjects(objects)

    console.log('Destroying CloudFormation stack')
    await destroyStack()
  } catch (err) {
    console.log(err)
  }
})()
