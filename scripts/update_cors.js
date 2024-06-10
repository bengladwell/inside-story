#!/usr/bin/env node

require('dotenv').config({ path: '.env.production' })
const { S3 } = require('@aws-sdk/client-s3');
const s3 = new S3({ region: process.env.AWS_REGION })
const Bucket = process.env.VIDEO_ASSET_BUCKET

function hasRule (rules) {
  return rules.CORSRules.find((rule) =>
    rule.AllowedOrigins.includes(`https://${process.env.SITE_DOMAIN}`))
}

(async () => {
  const corsRules = await s3.getBucketCors({ Bucket })
  if (hasRule(corsRules)) {
    console.log('CORS rule exists; skipping')
  } else {
    console.log(`Adding CORS rule for ${process.env.SITE_DOMAIN}`)
    const newRules = {
      CORSRules: corsRules.CORSRules.concat({
        AllowedHeaders: ['*'],
        AllowedMethods: ['HEAD', 'GET'],
        AllowedOrigins: [`https://${process.env.SITE_DOMAIN}`],
        ExposeHeaders: []
      })
    }
    await s3.putBucketCors({ Bucket, CORSConfiguration: newRules })
  }
})()
