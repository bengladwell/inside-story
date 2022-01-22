# Inside Story

A serverless video hosting app with gated user authentication.

Inside Story uses [Gatsby](https://www.gatsbyjs.com/) to display the video pages and a bunch of AWS resources, described with CloudFormation, to host, provide SSL, and handle authentication.

This project started out as an attempt to replace a simpler video hosting setup with something "serverless". It ended up being a big experiment with AWS and an opportunity to learn. (Read: this is way more complicated than the volume of my video site requires :) ) I wanted to have some public facing content - the login page, headers on the individual video pages so that previews would appear in social media postings - but also restrict access to videos of my kids. I wanted the restrictions to be real - ie not just hiding stuff with javascript. Finally, I wanted the setup to be self documenting so that there are no obscure settings deep in the AWS console to forget about.

The [CloudFormation template](https://github.com/bengladwell/inside-story/blob/master/lib/cloudformation.yml) has all the details in its 30-odd resources, but keep reading for an overview.

## User Auth

Allows for every user to be specifically granted access by the administrator. This is a video hosting site for family videos. I do not want it to be public, nor do I want users to have to remember separate credentials. I want to announce new content on social media and allow those users who have been authorized to immediately have access to that content.

### User flow

1. GET site page. User sees page with "login with Facebook" button.

<img width="1138" alt="Screen Shot 2021-05-13 at 8 37 32 AM" src="https://user-images.githubusercontent.com/686913/118126615-9636c380-b3c6-11eb-9231-f7f9fcd76963.png">

2. Login with Facebook. This redirects the user to a Cognito URL, which again redirects to Facebook login.

3. After logging in with Facebook, the user agent is redirected back to Cognito. Cognito executes a PreAuth hook, which is a Lambda function that checks for the presence of the user in a DynamoDB table.

3a. If the user has not yet been authorized in the DynamoDB table, they are redirected back to the site with a message explaining that their request will be reviewed. The Lambda function also adds the user to the DynamoDB table, leaving them unauthorized, and uses SES to email the administrator (me!).
<img width="1291" alt="Screen Shot 2021-05-13 at 8 41 21 AM" src="https://user-images.githubusercontent.com/686913/118127295-8075ce00-b3c7-11eb-8780-5cd4dafa63e5.png">
**User flow ends here for these users.**

3b. If the user has been authorized in the DynamoDB table, they are redirected back to the site with Cognito tokens as query string params.

4. An AJAX request is made to an API Gateway Endpoint. The Cognito accessToken is sent as the Authorization header. The API Gateway Endpoint validates the accessToken with Cognito before permitting the request.

5. If the token is valid, the Lambda function integrated with the Endoint provides signed cookies and the Endpoint returns them in its response. _Because the API Gateway is on the same domain as the protected assets, these cookies will be used when requesting the protected assets from their CloudFront Distribution._

6. Protected assets (videos) are requested from a CloudFront Distribution. This Distribution is configured to required signed cookies. The user can view protected content.
<img width="1368" alt="Screen Shot 2021-05-13 at 8 53 13 AM" src="https://user-images.githubusercontent.com/686913/118128417-dc8d2200-b3c8-11eb-8112-3cf1bbeedd8d.png">

## Resource Dependency Diagram

![Blank diagram - Relationship Diagram](https://user-images.githubusercontent.com/686913/118129640-6c7f9b80-b3ca-11eb-8004-2880ae709e09.png)

## For the truly hardcore, some UML sequence diagrams

![Blank diagram - Sequence Diagram](https://user-images.githubusercontent.com/686913/118129719-88833d00-b3ca-11eb-96fb-960ac0c51ace.png)

## Development notes

To start a new feature:
* create a new branch (no underscores)
* make changes to cloudformation.yml
* `npm run stack:create`
* `npm run stack:status` to check status or https://console.aws.amazon.com/cloudformation/home
* `npm run develop`
