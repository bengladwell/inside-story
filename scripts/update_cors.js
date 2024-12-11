#!/usr/bin/env node

require('dotenv').config({ path: '.env.production' })
const { S3 } = require('@aws-sdk/client-s3');
const s3 = new S3({ region: process.env.AWS_REGION })
const Bucket = process.env.VIDEO_ASSET_BUCKET

function hasRule (rules, domain) {
  return rules.CORSRules.find((rule) =>
    rule.AllowedOrigins.includes(`https://${domain}`))
}

(async () => {
  const corsRules = await s3.getBucketCors({ Bucket })

  const newRules = [process.env.SITE_DOMAIN, 'local.bengladwell.com'].reduce((acc, domain) => {
    if (hasRule(corsRules, domain)) {
      console.log(`CORS rule exists for ${domain}; skipping`)
      return acc
    }

    console.log(`Adding CORS rule for ${domain}`)
    return [...acc, {
      AllowedHeaders: ['*'],
      AllowedMethods: ['HEAD', 'GET'],
      AllowedOrigins: [`https://${domain}`],
      ExposeHeaders: []
    }]
  }, [])

  if (newRules.length) {
    await s3.putBucketCors({ Bucket, CORSConfiguration: { CORSRules: [...corsRules.CORSRules, ...newRules] } })
  }
})()
