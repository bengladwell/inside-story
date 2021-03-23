#!/usr/bin/env node

require('dotenv').config({ path: '.env.production' })
const _ = require('lodash')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const S3 = require('aws-sdk/clients/s3')
const s3 = new S3({ region: process.env.AWS_REGION })
const Bucket = process.env.VIDEO_ASSET_BUCKET

async function stackName () {
  const { stdout, stderr } = await exec('git branch --show-current')
  if (stderr) throw new Error(stderr)

  const branchName = stdout.substring(0, stdout.length - 1)

  return branchName === 'master' ? 'inside-story' : branchName
}

async function getBucketPolicy () {
  return s3.getBucketPolicy({ Bucket }).promise()
}

async function putBucketPolicy (policy) {
  return s3.putBucketPolicy({ Bucket, Policy: JSON.stringify(policy) }).promise()
}

(async () => {
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

  let newPolicy
  try {
    const bucketPolicyString = await getBucketPolicy()
    const bucketPolicy = JSON.parse(bucketPolicyString.Policy)

    if (bucketPolicy.Statement.find(s => _.isEqual(s, statement))) {
      console.log('Policy statement exists; skipping')
      return
    }

    newPolicy = {
      ...bucketPolicy,
      Statement: [
        ...bucketPolicy.Statement,
        statement
      ]
    }
  } catch (e) {
    if (e.code === 'NoSuchBucketPolicy') {
      newPolicy = {
        Version: '2008-10-17',
        Id: 'PolicyForCloudFrontPrivateContent',
        Statement: [statement]
      }
    } else {
      throw e
    }
  }

  console.log(`Adding policy statement for CloudFront Origin Access Identity ${process.env.VIDEO_ASSET_ORIGIN_ACCESS_IDENTITY}`)
  await putBucketPolicy(newPolicy)
})()
