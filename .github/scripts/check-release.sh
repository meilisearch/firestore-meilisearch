#!/bin/sh

# Checking if current tag matches the package version
current_tag=$(echo $GITHUB_REF | cut -d '/' -f 3 | tr -d ' ',v)
package_file_tag=$(grep '"version":' package.json | cut -d ':' -f 2- | tr -d ' ' | tr -d '"' | tr -d ',')
extension_tag=$(grep "version:" extension.yaml | cut -d ":" -f 2- | tr -d " " )
version_js_tag=$(grep "version =" functions/src/version.ts | cut -d "=" -f 2- | tr -d " " | tr -d "'" )
version_ts_tag=$(grep "version =" functions/lib/version.js | cut -d "=" -f 2- | tr -d " "| tr -d "'" | tr -d ";" | tail -n1 )

if [ "$current_tag" != "$package_file_tag" ]; then
  echo "Error: the current tag does not match the version in package file(s)."
  echo "$current_tag vs $package_file_tag"
  exit 1
fi

if [ "$package_file_tag" != "$extension_tag" ]; then
  echo "Error: the version in package file does not match the version in the extension file(s)."
  echo "$package_file_tag vs $extension_tag"
  exit 1
fi

if [ "$version_js_tag" != "$version_ts_tag" ]; then
  echo "Error: the version in version.ts does not match the version in version.js, you need to build the package."
  echo "$version_ts_tag vs $version_js_tag"
  exit 1
fi

echo 'OK'
exit 0
