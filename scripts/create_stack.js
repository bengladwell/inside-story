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

async function genEncryptionKey () {
  const { stdout, stderr } = await exec('openssl rand -base64 32')
  if (stderr) throw new Error(stderr)

  return stdout.substring(0, stdout.length - 1)
}

async function createStack () {
  try {
    const cfTemplate = await readFile('lib/cloudformation.yml', 'utf8')
    const StackName = await stackName()
    const privateKey = await genPrivateKey()
    const encryptionKey = await genEncryptionKey()
    const uriEncodedPrivateKey = encodeURI(privateKey)
    // WARNING: I have not yet tested this code path. I manually created the .secrets file during testing.
    // I did verify that update_stack.js successfully reads the manually created .secrets file.
    await writeFile(`.secrets.${StackName}`, `URI_ENCODED_PRIVATE_KEY=${uriEncodedPrivateKey}\nBASE64_ENCRYPTION_KEY=${encryptionKey}`)
    const publicKey = await genPublicKey(privateKey)
    const Parameters = await getParams(uriEncodedPrivateKey, publicKey, encryptionKey)

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
