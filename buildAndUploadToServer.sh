#!/bin/bash
cd apps/web
yarn build
rsync -zarvh //Users/karonte/dev/tacoSwap/9inchSwapUI/apps/web/out/* \
 karonte@159.65.55.38:/var/www/html/app9inchui/
