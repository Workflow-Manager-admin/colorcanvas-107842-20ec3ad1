#!/bin/bash
cd /home/kavia/workspace/code-generation/colorcanvas-107842-20ec3ad1/visualoom_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

