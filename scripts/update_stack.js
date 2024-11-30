#!/usr/bin/env node

const { CloudFormation } = require('@aws-sdk/client-cloudformation');
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const { stackName, genPublicKey, getParams } = require('./utils')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config()

const cloudFormation = new CloudFormation({
  region: process.env.AWS_REGION
})

async function updateStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    const StackName = await stackName()
    const secretsFilePath = path.resolve(process.cwd(), `./.secrets.${StackName}`)
    dotenv.config({ path: secretsFilePath })
    const privateKey = decodeURI(process.env.URI_ENCODED_PRIVATE_KEY)
    const uriEncodedPrivateKey = process.env.URI_ENCODED_PRIVATE_KEY
    const base64EncryptionKey = process.env.BASE64_ENCRYPTION_KEY
    const publicKey = await genPublicKey(privateKey)
    const Parameters = await getParams(uriEncodedPrivateKey, publicKey, base64EncryptionKey)

    return await cloudFormation.updateStack({
      StackName,
      TemplateBody: cfTemplate,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters
    });
  } catch (err) {
    console.log('Error updating stack')
    throw err
  }
}

(async () => {
  try {
    console.log(await updateStack())
  } catch (err) {
    console.log(err)
  }
})()
