package com.youme.video;

import android.app.Activity;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.WindowManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.youme.voiceengine.MemberChange;
import com.youme.voiceengine.NativeEngine;
import com.youme.voiceengine.YouMeCallBackInterface;
import com.youme.voiceengine.YouMeConst;
import com.youme.voiceengine.api;
import com.youme.voiceengine.mgr.YouMeManager;
import com.youme.voiceengine.video.SurfaceViewRenderer;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;

public class YoumeModule extends ReactContextBaseJavaModule implements AudioManager.OnAudioFocusChangeListener  {

  private static final String TAG = "YoumeModule";
  private boolean isInChannel=false;
  private Intent forgroundIntent;

  public YoumeModule(ReactApplicationContext context) {
    super(context);
    YouMeManager.Init(context);
    this.context = context;
  }

  @Override
  public String getName() {
    return "RCTYoume";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    return constants;
  }

  private final static String YOUME_ON_EVENT = "YOUME_ON_EVENT";
  private final static String YOUME_ON_RESTAPI = "YOUME_ON_RESTAPI";
  private final static String YOUME_ON_MEMBER_CHANGE = "YOUME_ON_MEMBER_CHANGE";
  private final static String YOUME_ON_STATISTIC_UPDATE = "YOUME_ON_STATISTIC_UPDATE";

  private boolean mixAudio = false;
  private ReactApplicationContext context;

  private static String readString(ReadableMap map, String key, String defaultValue) {
    return map.hasKey(key) ? map.getString(key) : defaultValue;
  }

  private static int readInt(ReadableMap map, String key, int defaultValue) {
    return map.hasKey(key) ? map.getInt(key) : defaultValue;
  }

  private static boolean readBoolean(ReadableMap map, String key, boolean defaultValue) {
    return map.hasKey(key) ? map.getBoolean(key) : defaultValue;
  }

  private WritableMap getResultMap(int event, int code, String channel, String param) {
    WritableMap map = Arguments.createMap();
    map.putInt("eventType", event);
    map.putInt("code", code);
    map.putString("channel", channel);
    map.putString("param", param);
    return map;
  }

  private ArrayList<Promise> initPromises = new ArrayList<>();
  private ArrayList<Promise> joinPromises = new ArrayList<>();
  private ArrayList<Promise> leavePromises = new ArrayList<>();
  private ArrayList<Promise> restapiPromises = new ArrayList<>();

  /**
   * @param options {appKey:"", secretKey:"", region:0, regionExt:"", testServer: boolean}
   * @param promise
   */
  @ReactMethod
  public void init(ReadableMap options, Promise promise) {
    try {
      YouMeManager.Init(getCurrentActivity());
      if(options.hasKey("serverMode")) {
        int serverMode = options.getInt("serverMode"); // 0 正常, 1 测试 ，7 私服
        NativeEngine.setServerMode(serverMode);
        if(serverMode == 7 || serverMode == 4){
          String ip = options.getString("serverIP");
          int port = options.getInt("serverPort");
          NativeEngine.setServerIpPort(ip, port);
        }
      }

      YoumeManager.getInstance().init(getReactApplicationContext());
      api.SetCallback(mRtcEventHandler);
      int code = api.init(options.getString("appKey"), options.getString("secretKey"), options.getInt("region"), options.hasKey("regionExt") ? options.getString("regionExt") : "");
      if (code != 0) {
        promise.reject(code + "", "init error");
      } else {
        initPromises.add(promise);
      }
    } catch (Exception e) {
      promise.reject("1001", e);
    }
  }

  /**
   * checkRoomExist not support now
   *
   * @param options {channel:"", userid:"", token:"", role: int, checkRoomExist:boolean,
   *                  fps: 15,
   *                  previewWidth: 480, previewHeight: 640,
   *                  sendWidth: 480, sendHeight: 640,
   *                  secondStreamWidth: 0,   secondStreamHeight: 0
   *                 }
   * @param promise
   */
  @ReactMethod
  public void joinChannel(ReadableMap options, Promise promise) {
    try {
      api.setVideoFrameCallback(VideoRendererManager.getInstance());
      api.SetVideoCallback(); //激活视频数据接收的回调
      //api.setAutoSendStatus(true);
      api.setToken(readString(options, "token", ""));
      api.setVideoFps(readInt(options,"fps",15));
      api.setAVStatisticInterval(5000);
      api.setVideoLocalResolution(readInt(options,"previewWidth",480),readInt(options,"previewHeight",640));
      api.setVideoNetResolution(readInt(options,"sendWidth",480),readInt(options,"sendHeight",640));
      api.setVideoPreviewFps(readInt(options,"previewFps",30));
      //开启讲话音量回调
      api.setMicLevelCallback(10);
      //开启远端语音音量回调
      api.setFarendVoiceLevelCallback(10);
      //设置android 前台service 标题信息，视频通话中把app放入后台可以激活通知栏的显示
      RTCService.contentTitle = readString(options, "serviceTitle", "YMService title");
      RTCService.contentText = readString(options, "serviceContent", "");

      if(options.hasKey("secondStreamWidth") && readInt(options,"secondStreamWidth",0) >0){
        api.setVideoNetResolutionForSecond(readInt(options,"secondStreamWidth",0),readInt(options,"secondStreamHeight",0));
        api.setVideoCodeBitrateForSecond( readInt(options,"secondStreamBitRateMax",0),readInt(options,"secondStreamBitRateMin",0));
        api.setVideoFpsForSecond(readInt(options,"secondStreamFPS",15));
        //设置为手动控制大小流模式
        //api.setVideoNetAdjustmode(1);
      }else{
        //api.setVideoNetAdjustmode(0);
      }
      if(options.hasKey("bitRateMin")) {
        api.setVideoCodeBitrate(readInt(options, "bitRateMax", 0),readInt(options, "bitRateMin", 0));
      }
      api.setVBR(readBoolean(options,"VBR",false));
      api.setVBRForSecond(readBoolean(options,"secondStreamVBR",false));

      boolean autoRecv = readBoolean(options,"autoRecvStream",false); //是否自动接收视频流

      YoumeManager.getInstance().updateJoinChannelInfo(readString(options, "userid", ""), readString(options, "channel", ""));
      mixAudio = options.hasKey("allowMixAudio") && options.getBoolean("allowMixAudio");
      if (!mixAudio) {
        Log.d(TAG,"requestAudioFocus");
        AudioManager audioManager = (AudioManager)this.context.getSystemService(this.context.AUDIO_SERVICE);
        if(audioManager != null) audioManager.requestAudioFocus(this, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
      }
      isInChannel = true;
      int code = api.joinChannelSingleMode(readString(options, "userid", ""),
              readString(options, "channel", ""),
              readInt(options, "role", 1),
              autoRecv
      );
      if (code != 0) {
        promise.reject(code + "", "call join fail");
      } else {
        joinPromises.add(promise);
      }
    } catch (Exception e) {
      Log.e(TAG,e.toString());
      promise.reject("1002", e);
    }
  }

  /**
   *
   * @param options not need param now
   * @param promise
   */
  @ReactMethod
  public void leaveChannel(ReadableMap options, Promise promise) {
    try {
      isInChannel = false;
      YoumeManager.getInstance().leaveChannel();
      int code = api.leaveChannelAll();
      YoumeManager.getInstance().currentShareUserId = "";
      if (code != 0) {
        promise.reject(code + "", "call leave fail");
      } else {
        leavePromises.add(promise);
      }
    } catch (Exception e) {
      promise.reject("1003", e);
    }
  }

  /**
   *
   * @param mute  true ,表示静音，false 表示非静音
   */
  @ReactMethod
  public void setMicrophoneMute(boolean mute) {
    api.setMicrophoneMute(mute);
  }

  /**
   *
   * @param mute  true ,表示静音，false 表示非静音
   */
  @ReactMethod
  public void setSpeakerMute(boolean mute) {
    api.setSpeakerMute(mute);
  }

  /**
   *
   * @param userTcp  true ,表示使用tcp传输媒体数据，false 表示使用udp，默认为false
   */
  @ReactMethod
  public void setTCP(boolean userTcp) {
    api.setTCPMode(userTcp);
  }

  /**
   * 设置网络适配模式，1为手动适配模式，0是自动适配模式，默认为0， 进频道前设置
   * @param adjustmode
   */
  @ReactMethod
  public void setVideoNetAdjustmode(int adjustmode) {
    api.setVideoNetAdjustmode(adjustmode);
  }

  /**
   * 开启屏幕常亮
   */
  @ReactMethod
  public void keepScreenOn() {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Activity currentActivity = getCurrentActivity();
        if(currentActivity!=null) {
          currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
      }
    });
  }

  /**
   * 取消屏幕常亮
   */
  @ReactMethod
  public void cancelScreenOn() {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Activity currentActivity = getCurrentActivity();
        if(currentActivity!=null) {
          currentActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
      }
    });
  }

  /**
   * 开启摄像头
   */
  @ReactMethod
  public void startCapturer(boolean switchWithHeightIfLandscape) {
    //横竖屏分辨率交换自动设置
    //如果设置为true，那么在屏幕发生横竖屏变化时，再通知给screenRotationChange，
    // 就可以实现内置横竖屏自动切换width 和 height分辨率
    if(switchWithHeightIfLandscape) api.screenRotationChange();
    api.startCapturer();
  }

  /**
   * 关闭摄像头
   */
  @ReactMethod
  public void stopCapturer() {
    api.stopCapturer();
  }

  /**
   * 设置是否从听筒输出，默认是没有耳机从扬声器输出，插入耳机从耳机输出。如需强制听筒输出，需要传入false
   */
  @ReactMethod
  public void outputToSpeaker(boolean outputToSpeaker) {
    api.setOutputToSpeaker(outputToSpeaker);
  }

  /**
   * 设置是否同步自己的设备开关状态
   */
  @ReactMethod
  public void setAutoSendStatus(boolean sync) {
    api.setAutoSendStatus(sync);
  }

  /**
   * 控制其它人的麦克风开关
   */
  @ReactMethod
  public void setOtherMicMute(String userid, boolean mute) {
    api.setOtherMicMute(userid, mute);
  }

  /**
   * 设置是否收听指定userid的语音
   */
  @ReactMethod
  public void setListenOtherVoice(String userid, boolean listen) {
    api.setListenOtherVoice(userid, listen);
  }

  /**
   * 设置是否屏蔽指定userid的视频
   */
  @ReactMethod
  public void maskVideoByUserId(String userid, boolean block) {
    api.maskVideoByUserId(userid, block);
  }

  /**
   * 切换前后摄像头
   */
  @ReactMethod
  public void switchCamera() {
    api.switchCamera();
  }

  /**
   * 设置屏幕旋转角度，只支持 0，1，2，3，分别对应 0° ，90° ，180°， 270°
   */
  @ReactMethod
  public void screenRotationChange() {
    api.screenRotationChange();
  }

  /**
   * 切换前后摄像头
   */
  @ReactMethod
  public void applicationInBackground() {
    if(isInChannel)
    {
      try{
        RTCService.mContext = getReactApplicationContext();
        RTCService.mActivity = getCurrentActivity();
        if(RTCService.mContext !=null && RTCService.mActivity!=null) {
          forgroundIntent = new Intent(getCurrentActivity(), RTCService.class);
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.context.startForegroundService(forgroundIntent);
          } else {
            this.context.startService(forgroundIntent);
          }
        }
      }catch (Throwable e){
        e.printStackTrace();
      }
    }
    VideoRendererManager.getInstance().pauseRender();
  }

  /**
   * 切换前后摄像头
   */
  @ReactMethod
  public void applicationInFront() {
    VideoRendererManager.getInstance().resumeRender();
    if(forgroundIntent != null){
      try {
        this.context.stopService(forgroundIntent);
      }catch (Throwable e){
        e.printStackTrace();
      }
    }
  }

  /**
   * 提出指定 userid
   */
  @ReactMethod
  public void kickOtherFromChannel(String userid, String channel, int forbidSecond) {
    api.kickOtherFromChannel(userid, channel, forbidSecond);
  }

  /**
   * 设置是否屏蔽指定userid的视频
   */
  @ReactMethod
  public void setUsersVideoInfo(ReadableArray usersStreamInfo) {
    ArrayList<String> userIds =  new ArrayList<>();
    ArrayList<Integer> streamIds = new ArrayList<>();
    for(int i=0; i< usersStreamInfo.size(); i++)
    {
      ReadableMap userInfo = usersStreamInfo.getMap(i);
      userIds.add(userInfo.getString("userID"));
      streamIds.add(userInfo.getInt("streamID"));
    }
    if(userIds.size()>0 && streamIds.size() >0) {
      int[] ids = new int[streamIds.size()];
      for (int i = 0; i < ids.length; i++) {
        ids[i] = (int) streamIds.get(i);
      }
      api.setUsersVideoInfo(userIds.toArray(new String[0]), ids);
    }else{
      Log.e(TAG, "setUsersVideoInfo: error" );
    }
  }

  /**
   * 设置大流码率
   */
  @ReactMethod
  public void setVideoCodeBitrate(int minBitRateKbps, int maxBitRateKbps) {
    api.setVideoCodeBitrate(minBitRateKbps, maxBitRateKbps);
  }

  /**
   * 设置小流码率
   */
  @ReactMethod
  public void setVideoCodeBitrateForSecond(int minBitRateKbps, int maxBitRateKbps) {
    api.setVideoCodeBitrateForSecond (minBitRateKbps, maxBitRateKbps);
  }

  /**
   * 设置大流fps
   */
  @ReactMethod
  public void setVideoFps(int fps) {
    api.setVideoFps( fps );
  }

  /**
   * 设置小流fps
   */
  @ReactMethod
  public void setVideoFpsForSecond(int fps) {
    api.setVideoFpsForSecond(fps);
  }

   /**
   * 设置预览fps
   */
  @ReactMethod
  public void setVideoPreviewFps(int fps) {
    api.setVideoPreviewFps(fps);
  }

  /**
   * 设置是否开启美颜
   */
  @ReactMethod
  public void openBeautify(boolean isOpen) {
    api.openBeautify(isOpen);
  }

  /**
   * 设置美颜等级，有效返回 0.0  - 1.0
   */
  @ReactMethod
  public void setBeautyLevel(Float level) {
    Log.e(TAG,"setBeautyLevel:"+ level);
    api.setBeautyLevel(level);
  }


  @ReactMethod
  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  private YouMeCallBackInterface mRtcEventHandler = new YouMeCallBackInterface() {

    @Override
    public void onEvent(final int eventType, final int code, final String channel, final Object param) {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          switch (eventType) {
            case YouMeConst.YouMeEvent.YOUME_EVENT_INIT_OK:
            {
              YoumeManager.getInstance().inited();
              if (initPromises.size() > 0) {
                initPromises.remove(0).resolve(getResultMap(eventType, code, channel, param.toString()));
              }else{
                Log.e(getName(),"init ok, but no promise find");
              }
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_INIT_FAILED:
            {
              if (initPromises.size() > 0) {
                initPromises.remove(0).reject(String.valueOf(YouMeConst.YouMeEvent.YOUME_EVENT_INIT_FAILED), channel);
              }else{
                Log.e(getName(),"init fail, but no promise find");
              }
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_JOIN_FAILED:
            {
              isInChannel = false;
              if (joinPromises.size() > 0) {
                joinPromises.remove(0).reject(String.valueOf(YouMeConst.YouMeEvent.YOUME_EVENT_INIT_FAILED), channel);
              }else{
                Log.e(getName(),"join fail, but no promise find");
              }
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_JOIN_OK:
            {
              if (joinPromises.size() > 0) {
                joinPromises.remove(0).resolve(getResultMap(eventType, code, channel, param.toString()));
              }else{
                Log.e(getName(),"join ok, but no promise find");
              }
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_LEAVED_ALL:
            {
              if (leavePromises.size() > 0) {
                leavePromises.remove(0).resolve(getResultMap(eventType, code, channel, param.toString()));
              }else{
                Log.e(getName(),"leave ok, but no promise find");
              }
              if (!mixAudio){
                AudioManager audioManager = (AudioManager) context.getSystemService(context.AUDIO_SERVICE);
                if(audioManager != null){
                  Log.d(TAG,"abandonAudioFocus");
                  audioManager.abandonAudioFocus(YoumeModule.this );
                }
              }
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_OTHERS_VIDEO_SHUT_DOWN:
            {
              api.deleteRenderByUserID(param.toString());
            }
            break;
            case YouMeConst.YouMeEvent.YOUME_EVENT_OTHERS_VIDEO_ON:
            {

              Log.d(TAG, "video _on: "+param.toString());
              YoumeManager.getInstance().updateResolution(param.toString(), code);
              /* 非自动接收模式不需要再做这个hack
              TimerTask task = new TimerTask() {
                @Override
                public void run() {
                  Vector<SurfaceViewRenderer> renderInfos = VideoRendererManager.getInstance().getRender(param.toString());

                  if(renderInfos == null || renderInfos.size() == 0) {
                    Log.d(TAG, "run: "+param.toString());
                    if( param.toString().indexOf("_share" ) < 0 && !param.equals(YoumeManager.getInstance().currentShareUserId) ){
                      api.maskVideoByUserId(param.toString(), true);
                    }
                  }
                }
              };
              Timer timer = new Timer();
              timer.schedule(task, 150);
              */

            }
            default: {
              if(eventType == 223 && param.toString().length() >6){ //YOUME_EVENT_OTHERS_SHARE_INPUT_START
                String userID =  param.toString().substring(0,param.toString().length() - 6);
                YoumeManager.getInstance().currentShareUserId = userID;
                api.maskVideoByUserId(userID, false);
              }else if(eventType == 224){ //YOUME_EVENT_OTHERS_SHARE_INPUT_STOP
                if(YoumeManager.getInstance().currentShareUserId != null && YoumeManager.getInstance().currentShareUserId.equals(param.toString())) {
                  // 先检查是否是当前在共享的用户发出的stop事件，避免意外停止接收共享
                  YoumeManager.getInstance().currentShareUserId = "";
                }
              }
              WritableMap map = Arguments.createMap();
              map.putInt("eventType", eventType);
              map.putInt("code", code);
              map.putString("channel", channel);
              map.putString("param", param.toString());
              sendEvent(getReactApplicationContext(), YOUME_ON_EVENT, map);
            }

          }
        }
      });
    }

    @Override
    public void onRequestRestAPI(final int requestID, final int code, final String query, final String result) {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          WritableMap map = Arguments.createMap();
          map.putInt("code", code);
          map.putString("query", query);
          map.putString("result", result);
          sendEvent(getReactApplicationContext(), YOUME_ON_RESTAPI, map);
        }
      });
    }

    @Override
    public void onMemberChange(final String channel, final MemberChange[] changeList, final boolean isUpdate) {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          WritableMap map = Arguments.createMap();
          map.putInt("code", 0);
          map.putString("channel", channel);
          map.putBoolean("isUpdate", isUpdate);
          WritableArray userList = Arguments.createArray();
          for (int i = 0; i < changeList.length; i++) {
            WritableMap user = Arguments.createMap();
            user.putString("userid", changeList[i].userID);
            user.putBoolean("isJoin", changeList[i].isJoin);
            userList.pushMap(user);
          }
          map.putArray("memberList", userList);
          sendEvent(getReactApplicationContext(), YOUME_ON_MEMBER_CHANGE, map);
        }
      });
    }

    @Override
    public void onBroadcast(int i, String s, String s1, String s2, String s3) {

    }

    /**
    *  功能描述: 音视频通话码率、丢包率回调，目前主要用于检测某个用户的网络状况
    *  @param avType   统计数据类型
    *  @param userID   对应的用户ID
    *  @param value    统计数据数值
    */
    @Override
    public void onAVStatistic(final int avType,  final String userID, final int value) {
      runOnUiThread(new Runnable(){
        @Override
        public void run(){
          WritableMap map = Arguments.createMap();
          switch(avType){
            case YouMeConst.YouMeAVStatisticType.YOUME_AVS_AUDIO_PACKET_UP_LOSS_HALF:   //音频上行的服务器丢包率,千分比
            case YouMeConst.YouMeAVStatisticType.YOUME_AVS_VIDEO_PACKET_UP_LOSS_HALF:   //视频上行的服务器丢包率,千分比
            case YouMeConst.YouMeAVStatisticType.YOUME_AVS_AUDIO_PACKET_DOWN_LOSS_RATE:   //音频下行丢包率,千分比
            case YouMeConst.YouMeAVStatisticType.YOUME_AVS_VIDEO_PACKET_DOWN_LOSS_RATE:   //视频下行丢包率,千分比
              map.putInt("avType", avType);
              map.putString("userId", userID);
              map.putInt("value", value);
              sendEvent(getReactApplicationContext(), YOUME_ON_STATISTIC_UPDATE, map);
              break;
            default:
              break;
          }
        }
      });
    }

    @Override
    public void onTranslateTextComplete(int i, int i1, String s, int i2, int i3) {

    }
  };

  @Override
  public void onAudioFocusChange(int focusChange) {

  }
}
