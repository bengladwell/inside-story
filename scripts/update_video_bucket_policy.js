#!/usr/bin/env node

require('dotenv').config({ path: '.env.production' })
const _ = require('lodash')
const { S3 } = require('@aws-sdk/client-s3')
const s3 = new S3({ region: process.env.AWS_REGION })
const Bucket = process.env.VIDEO_ASSET_BUCKET
const { stackName } = require('./utils');

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
    const bucketPolicyString = await s3.getBucketPolicy({ Bucket })
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
  console.dir(newPolicy, { depth: null })
  await s3.putBucketPolicy({ Bucket, Policy: JSON.stringify(newPolicy) })
})()
