#!/usr/bin/env node

const { CloudFormation } = require('@aws-sdk/client-cloudformation');
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const { stackName, genPublicKey, getParams } = require('./utils')

require('dotenv').config()

const cloudFormation = new CloudFormation({ region: process.env.AWS_REGION })

async function genPrivateKey () {
  const { stdout, stderr } = await exec('openssl genrsa 2048')
  if (stderr && !stderr.match(/^Generating RSA private key, 2048 bit long modulus/)) {
    throw new Error(stderr)
  }

  return stdout.substring(0, stdout.length - 1)
}

async function createStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    const StackName = await stackName()
    const privateKey = await genPrivateKey()
    const uriEncodedPrivateKey = encodeURI(privateKey)
    await writeFile(`.secrets.${StackName}`, uriEncodedPrivateKey)
    const publicKey = await genPublicKey(privateKey)
    const Parameters = await getParams(uriEncodedPrivateKey, publicKey)

    return await cloudFormation.createStack({
      StackName,
      TemplateBody: cfTemplate,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters
    })
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
