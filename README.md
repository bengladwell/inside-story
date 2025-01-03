# Inside Story

A serverless video hosting app with gated user authentication.

Inside Story is a bunch of AWS resources, described with CloudFormation, to host, provide SSL, and handle authentication for a personal video site.

This project started out as an attempt to replace a simpler video hosting setup with something "serverless". It ended up being a big experiment with AWS and an opportunity to learn. (Read: this is way more complicated than the volume of my video site requires :) ) I wanted to have some public facing content - the login page, headers on the individual video pages so that previews would appear in social media postings - but also restrict access to videos of my kids. I wanted the restrictions to be real - ie not just hiding stuff with javascript. Finally, I wanted the setup to be self documenting so that there are no obscure settings deep in the AWS console to forget about.

The [CloudFormation template](https://github.com/bengladwell/inside-story/blob/main/lib/cloudformation.yml) has all the details in its 30+ resources, but keep reading for an overview.

## User Auth

Allows for every user to be specifically granted access by the administrator. This is a video hosting site for family videos. I do not want it to be public, nor do I want users to have to remember separate credentials. I want to announce new content on social media and allow those users who have been authorized to immediately have access to that content.

### User flow

1. GET site page. User is able to login with Cognito directly or with Google.

2. Click login. This redirects the user to an API Gateway / Lambda endpoint that computes a state token and redirects to the Cognito login page.

2. Using a post confirmation Lambda trigger, Cognito adds a `custom:is_approved` attribute to the user with value `"false"`. An email is also sent to the admistrator, notifying them of the new user.

2. Using a pre token generation Lambda trigger, Cognito adds a claim to the ID token: `is_approved`. This claim determines if the user can see private content.

3. After logging in with Cognito or Google, the user agent is redirected to another API Gateway / Lambda endpoint. This endpoint does the following:
  * Validates the state token.
  * Retrieves an ID token from the Cognito user pool.
  * Retreives presigned cookies that will allow access to the video assets.
  * Sets the ID token as a JS-accessible cookie and the presigned cookies as HttpOnly cookies.
  * Redirects to the site.

3. If the user is not `is_approved`, they are shown a message that their account is pending approval. They are not able to see content on the site. Javascript is used to hide content, but more importantly, these users do not get signed cookies are are not able to access the video assets.
**User flow ends here for these users.**

3. If the user `is_approved`, protected assets (videos) are requested from a CloudFront Distribution. This Distribution is configured to required signed cookies. The user can view protected content.

## Development notes

### System requirements

* brew install caddy imagemagick

### Run the site locally
* `rake serve`
* add `127.0.0.1  local.bengladwell.com` to /etc/hosts
* caddy reverse-proxy --to localhost:4000 --from local.bengladwell.com --internal-certs

To start a new feature:
* create a new branch (no underscores)
* make changes to cloudformation.yml
* `rake stack:create`
* `rake stack:status` to check status or https://console.aws.amazon.com/cloudformation/home
* `rake clean`
* `rake build deploy`
* Add user pool redirect URL to identity providers
* `rake stack:update` to apply changes to the stack as needed

Stack creation requires AWS CLI credentials. Easiest way:
* `brew install awscli`
* `aws configure`
