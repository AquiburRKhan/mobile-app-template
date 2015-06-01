#!/bin/sh

echo " "
echo "Creating Project:"
echo " "

read -p "Enter App Name (No Spaces) [REQUIRED]: " APP_NAME

if [[ "$APP_NAME" ]]; then
	echo " "
	phonegap create $APP_NAME com.manifestinteractive.$APP_NAME $APP_NAME
	cd $APP_NAME
else
	echo " "
	echo "!!! Unable to Continue. App Name is Requred."
	echo " "
	exit
fi

echo " "
echo "Installing / Updating: phonegap, cordova, grunt-cli & bower"
echo " "

sudo npm update -g phonegap cordova grunt-cli bower

echo " "
echo "Clone Repository:"
echo " "

rm -fr www
git clone -b stable git@github.com:manifestinteractive/mobile-app-template.git www

echo " "
echo "Updating Cordova Defaults:"
echo " "

rm -fr hooks
rm config.xml

cp -r www/hooks ./
cp www/config.xml ./

chmod 755 hooks/after_prepare/010_remove_junk.js

echo " "
echo "Copy Config File:"
echo " "

cp www/settings.json.dist www/settings.json

echo " "
echo "Adding Platforms:"
echo " "

cordova platform add ios
cordova platform add android

echo " "
echo "Installing Required Native Plugins:"
echo " "

cordova plugin add org.apache.cordova.battery-status
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.contacts
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.device-motion
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.network-information
cordova plugin add org.apache.cordova.splashscreen
cordova plugin add cordova-plugin-inappbrowser

echo " "
echo "Installing Required Third-Party Plugins:"
echo " "

cordova plugin add https://github.com/apache/cordova-plugin-whitelist.git
cordova plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
cordova plugin add https://github.com/apache/cordova-plugin-statusbar.git
cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
cordova plugin add https://github.com/katzer/cordova-plugin-background-mode.git

echo " "
echo "Replace iOS & Android Build Files ( modified from default ):"
echo " "

rm platforms/ios/$APP_NAME/Resources/icons/*.png
rm platforms/ios/$APP_NAME/Resources/splash/*.png
rm -fr platforms/android/res/drawable*

cp www/build/ios/icons/*.png platforms/ios/$APP_NAME/Resources/icons/
cp www/build/ios/splash/*.png platforms/ios/$APP_NAME/Resources/splash/
cp -R www/build/android/* platforms/android/res/

echo " "
echo "Starting Node Server"
echo " "

cd www
gem install sass
npm install
npm start
