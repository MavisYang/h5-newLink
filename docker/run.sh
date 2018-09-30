#!/bin/sh
# sed -i "s/APPID = '\(.*\)'/APPID = '$WX_APP_ID'/g" key.js
sed -i "s/\${APPID}/${APPID}/g" key.js
sed -i "s~\${REDIRECTURL}~${REDIRECTURL}~g" key.js
sed -i "s/\${FLAG}/${FLAG}/g" key.js
sed -i "s/\${COMPONENT_APPID}/${COMPONENT_APPID}/g" key.js
cp nginx.conf /etc/nginx/
nginx