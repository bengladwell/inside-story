#!/usr/bin/env node

require('dotenv').config({ path: '.env.production' })
const S3 = require('aws-sdk/clients/s3')
const s3 = new S3({ region: process.env.AWS_REGION })
const Bucket = process.env.VIDEO_ASSET_BUCKET

async function getCorsRules () {
  return s3.getBucketCors({ Bucket }).promise()
}

async function putCorsRules (rules) {
  return s3.putBucketCors({ Bucket, CORSConfiguration: rules }).promise()
}

function hasRule (rules) {
  return rules.CORSRules.find((rule) =>
    rule.AllowedOrigins.includes(`https://${process.env.CLOUDFRONT_DOMAIN}`))
}

(async () => {
  const corsRules = await getCorsRules()
  if (hasRule(corsRules)) {
    console.log('CORS rule exists; skipping')
  } else {
    console.log(`Adding CORS rule for ${process.env.CLOUDFRONT_DOMAIN}`)
    const newRules = {
      CORSRules: corsRules.CORSRules.concat({
        AllowedHeaders: ['*'],
        AllowedMethods: ['HEAD', 'GET'],
        AllowedOrigins: [`https://${process.env.CLOUDFRONT_DOMAIN}`],
        ExposeHeaders: []
      })
    }
    await putCorsRules(newRules)
  }
})()
