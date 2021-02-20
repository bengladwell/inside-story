#!/bin/bash

BRANCH=$(git branch --show-current)

if [ $BRANCH == "master" ]; then
  STACK_NAME=inside-story
else
  STACK_NAME=$BRANCH
fi

aws cloudformation describe-stacks --stack-name $STACK_NAME | jq -r '.Stacks[0].StackStatus'
