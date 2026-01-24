#!/bin/sh

# Generate config.json from environment variables
CONFIG_FILE="/usr/share/nginx/html/config.json"

# Create config.json with environment variables (empty strings if not set)
cat > "$CONFIG_FILE" << EOF
{
  "parentSiteUrl": "${PARENT_SITE_URL:-}",
  "parentSiteLogo": "${PARENT_SITE_LOGO:-}",
  "parentSiteName": "${PARENT_SITE_NAME:-}"
}
EOF

echo "Generated config.json with:"
echo "  PARENT_SITE_URL: ${PARENT_SITE_URL:-<not set>}"
echo "  PARENT_SITE_LOGO: ${PARENT_SITE_LOGO:-<not set>}"
echo "  PARENT_SITE_NAME: ${PARENT_SITE_NAME:-<not set>}"

# Start nginx
exec nginx -g 'daemon off;'
