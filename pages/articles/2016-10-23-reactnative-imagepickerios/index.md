---
layout: post
title: ReactNative ImagePickerIOS 使用教程
datePublished: '2016-10-23 11:21:04'
category: react-native
---

ImagePickerIOS 是 RN 里面的一个获取图片的 API，不过这个API只是在 IOS平台用的。但是官方文档只有简单的几个方法名：
```
static canRecordVideos(callback) 
static canUseCamera(callback) 
static openCameraDialog(config, successCallback, cancelCallback) 
static openSelectDialog(config, successCallback, cancelCallback) 
```

一开始以为这个 API 能够直接用，试了一下发现没有用，因为这个 API 是原生的功能模块，所以要在项目里设置一下才能用。
具体也很简单，和使用其他的第三方RN原生模块一样，要把模块添加到Libraries里面

创建项目

react-native init rnimage

用 Xcod 打开项目，开始设置，整个过程基本就是这三个图

![Imgur](http://i.imgur.com/q99upIC.jpg)

![Imgur](http://i.imgur.com/bRlRSuU.jpg)

把 node_modules/react-native/Libraries/CameraRoll 拖到 Libraries 里面去

![Imgur](http://i.imgur.com/FWLO7XN.jpg)
在 BuildPhases 里面link Binary With Libraries 里面添加 libRCTCameraRoll

设置好后就可以在JS代码里直接用了
```js
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ImagePickerIOS,
  InteractionManager,
  Image,
} from 'react-native';

export default class rnimage extends Component {
  constructor() {
    super();
    this.state = { image: null };
  }

  componentDidMount() {
    this.pickImage();
  }

  pickImage() {
    ImagePickerIOS.canRecordVideos(() => alert('能获取视频'))
    
    ImagePickerIOS.canUseCamera(() => alert('能获取图片'))
     // openSelectDialog(config, successCallback, errorCallback);
    ImagePickerIOS.openSelectDialog({}, () => {
      this.setState({ image: imageUri });
    }, error => console.error(error));
  }


  render() {
    return (
      <View style={{ flex: 1,padding: 15 }}>
      <Text>ImagePickerIOS</Text>
        {this.state.image?
          <Image style={{ flex: 1}} source={{ uri: this.state.image }} /> :
          null
        }
      </View>
    );
  }
}
AppRegistry.registerComponent('rnimage', () => rnimage);
```

整个 demo 在 Github 上 https://github.com/Code-In-Action/ReactNative-in-action/tree/master/rnimage