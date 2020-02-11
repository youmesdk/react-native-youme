/**
 * react-native-youme 插件 demo
 */
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import { YoumeVideoEngine, YoumeView } from 'react-native-youme';
import { YOUME_REACT_NATIVE_EVENT, YOUME_EVENT_TYPE } from 'react-native-youme/lib/types';

//视频初始化配置
const videoInitialConfig = {
  sendWidth: 480,
  sendHeight: 640,
  bitRateMin: 160,
  bitRateMax: 600,
  secondStreamWidth: 256,
  secondStreamHeight: 336,
  secondStreamBitRateMin: 100,
  secondStreamBitRateMax: 200,
};

export default class App extends Component {

  state = {
    userId: Date.now() + '',
    roomId: '',
    memberMap: new Map(),
    hasJoinedRoom: false
  }

  componentDidMount() {
    this.initYoumeVideoEngine();
    //监听房间成员变化事件
    YoumeVideoEngine.on(YOUME_REACT_NATIVE_EVENT.YOUME_ON_MEMBER_CHANGE, this.onMemberChange);
  }

  //初始化 react-native-youme 插件
  initYoumeVideoEngine = async () => {
    try {
      await YoumeVideoEngine.init({
        appKey: 'YOUME5BE427937AF216E88E0F84C0EF148BD29B691556',
        secretKey: 'y1sepDnrmgatu/G8rx1nIKglCclvuA5tAvC0vXwlfZKOvPZfaUYOTkfAdUUtbziW8Z4HrsgpJtmV/RqhacllbXD3abvuXIBlrknqP+Bith9OHazsC1X96b3Inii6J7Und0/KaGf3xEzWx/t1E1SbdrbmBJ01D1mwn50O/9V0820BAAE=',
        region: 10001,
        regionExt: '',
        serverMode: 0, //0 正常, 1 测试 ，7 私服
        serverIP: '',
        serverPort: 9002
      })
    } catch (e) {
      YoumeVideoEngine.leaveChannel();
    }
  }

  /**
   * 加入频道
   * @param { string } userID 用户ID
   * @param { string } channel 频道号
   * @param { string } userRole 用户角色
   * @param { string } checkRoomExist 检查房间是否存在
   * @param { string } isMicrophoneMute 是否静音麦克风
   * @param { string } isCameraOpen 是否打开摄像头
   */
  joinChannel = async (userID, channel, userRole, checkRoomExist, isMicrophoneMute, isCameraOpen) => {
    this.currentChannel = channel; // 保存当前的 channel

    const getConfigValue = key => {
      let value = videoInitialConfig[key];
      return parseInt(value);
    };

    let option = {
      userid: userID,
      channel: channel,
      token: '',
      role: userRole,
      checkRoomExist: checkRoomExist,
      fps: 12,
      previewWidth: getConfigValue('sendWidth'),
      previewHeight: getConfigValue('sendHeight'),
      sendWidth: getConfigValue('sendWidth'),
      sendHeight: getConfigValue('sendHeight'),
      bitRateMin: getConfigValue('bitRateMin'), //最小码率kbps
      bitRateMax: getConfigValue('bitRateMax'),  //最高码率kbps
      VBR: true,
      secondStreamWidth: getConfigValue('secondStreamWidth'),
      secondStreamHeight: getConfigValue('secondStreamHeight'),
      secondStreamFPS: 10,
      secondStreamBitRateMin: getConfigValue('secondStreamBitRateMin'),//kbps
      secondStreamBitRateMax: getConfigValue('secondStreamBitRateMax'),//kbps
      secondStreamVBR: true,
      autoRecvStream: false,
      serviceTitle: `会议号：${channel}`, // Android: 如果用户在会议中，并将 App 置于后台，serviceTitle 将显示于通知栏中
      serviceContent: '', // Android: 如果用户在会议中，并将 App serviceContent 将显示于通知栏中
    };

    try {
      YoumeVideoEngine.openBeautify(true);
      YoumeVideoEngine.setVideoNetAdjustmode(1);
      YoumeVideoEngine.setBeautyLevel(Platform.OS === 'android' ? 0.1 : 0.5);
      const joinResult = await YoumeVideoEngine.joinChannel(option);

      if (joinResult.eventType === YOUME_EVENT_TYPE.YOUME_EVENT_JOIN_FAILED) {
        throw new Error('加入频道错误');
      }

      //进入频道成功后，设置自己的设备初始化状态
      this.currentUserID = joinResult.param;
      // 将扬声器设置为开启状态，false 为开启扬声器，true 为关闭扬声器
      YoumeVideoEngine.setSpeakerMute(false);
      // 将麦克风设置为开启状态，false 为开启麦克风，true 为关闭麦克风
      YoumeVideoEngine.setMicrophoneMute(isMicrophoneMute);
      // 设置通知别人麦克风和扬声器，true 表示为通知，false 表示为不通知。
      YoumeVideoEngine.setAutoSendStatus(true);
      // 设置屏幕常亮
      YoumeVideoEngine.keepScreenOn();
      if (isCameraOpen) {
        YoumeVideoEngine.startCapturer(true);
      }
      this.setState({ hasJoinedRoom: true });
    } catch ({ message }) {
      throw new Error(`join channel error:${message}`);
    }
  }

  //退出频道
  leaveChannel = async () => {
    try {
      YoumeVideoEngine.outputToSpeaker(true);
      //关闭屏幕常亮
      YoumeVideoEngine.cancelScreenOn();
      await YoumeVideoEngine.leaveChannel();
    } catch ({ message, code }) {
      console.warn(`TalkService-> leaveChannel -> ${message}, code: ${code}`);
    }
  }

  //更新频道成员列表
  updateMemberList = (userId, userStatus) => {
    const { memberMap } = this.state;
    memberMap.set(userId, userStatus);
    this.setState({ memberMap });
  }

  //修改房间号
  changeRoomId = (roomId) => {
    this.setState({ roomId });
  }

  //加入房间
  joinRoom = () => {
    const { userId, roomId } = this.state;
    this.joinChannel(userId, roomId, 1, false, true, true);
  }

  //离开房间
  leaveRoom = async () => {
    await this.leaveChannel();
    this.setState({ hasJoinedRoom: false, memberMap: new Map() });
  }

  //监听房间成员变化事件回调函数
  onMemberChange = ({ memberList, isUpdate }) => {
    const { memberMap } = this.state;
    memberList.forEach(member => {
      const userId = member.userid;
      if (member.isJoin) {
        memberMap.set(userId, { userId });
      } else {
        memberMap.delete(userId);
      }
    });
    this.setState({ memberMap });
  }

  //渲染视频组件
  renderYoumeView({ item }) {
    const { userId } = item;

    const youmeViewProps = {
      style: styles.youmeVideo,
      zOrderMediaOverlay: true,
      options: {
        userID: userId,
        autoMask: true,
        bgColor: 0xF5FCFF,
        hd: false //低清流
      }
    };
    return <YoumeView key={userId} {...youmeViewProps} />;
  }

  render() {
    const { memberMap, roomId, hasJoinedRoom } = this.state;
    const memberList = [...memberMap.values()].sort((a, b) => b.userId - a.userId);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Youme Example</Text>
        <View style={styles.joinBlock}>
          <TextInput
            editable={!hasJoinedRoom}
            style={styles.roomIdInput}
            placeholder="请输入房间号"
            onChangeText={this.changeRoomId}
            value={this.state.roomId} />
          <Button
            onPress={this.joinRoom}
            style={styles.button}
            disabled={hasJoinedRoom || !roomId}
            title="加入房间" />
          <Button
            onPress={this.leaveRoom}
            style={styles.button}
            disabled={!hasJoinedRoom}
            title="退出房间" />
        </View>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={memberList}
          renderItem={this.renderYoumeView}
          keyExtractor={({ userId }) => userId}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  joinBlock: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  roomIdInput: {
    width: '50%',
    height: 40,
    fontSize: 16,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    textAlignVertical: 'center'
  },
  button: {
    width: '25%',
    height: 20,
    fontSize: 30
  },
  list: {
    width: '100%'
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 10
  },
  youmeVideo: {
    width: '100%',
    height: 200,
    marginVertical: 5
  }
});
