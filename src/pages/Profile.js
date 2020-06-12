import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile({ navigation }){

    const github_username = navigation.getParam('github_username');

    return <WebView style={{ flex: 1 }} source={{ uri: `https://www.github.com/${github_username}` }}/>
    // return <View/>
}

export default Profile;