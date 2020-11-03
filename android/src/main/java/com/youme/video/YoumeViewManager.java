package com.youme.video;

import android.os.Handler;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.youme.voiceengine.api;
import com.youme.voiceengine.video.SurfaceViewRenderer;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;


public class YoumeViewManager extends SimpleViewManager<YoumeVideoView> {

    public static final String REACT_COMPONENT_NAME = "RCTYoumeView";
    public static final String TAG = "YoumeViewManager";
    private static long createCount = 0;
    private long currentCount = 0;


    @Override
    public String getName() {
        return REACT_COMPONENT_NAME;
    }

    @Override
    protected YoumeVideoView createViewInstance(ThemedReactContext reactContext) {
        YoumeVideoView videoView =  new YoumeVideoView(reactContext);
        currentCount = ++createCount ;
        return  videoView;
    }

    @ReactProp(name = "zOrderMediaOverlay")
    public void setZOrderMediaOverlay(final YoumeVideoView videoView, boolean zOrderMediaOverlay) {
        videoView.zOrderMediaOverlay = zOrderMediaOverlay;
        if (videoView.surfaceView != null) {
            Log.d(REACT_COMPONENT_NAME, "setZOrderMediaOverlay:" + zOrderMediaOverlay);
            videoView.surfaceView.setZOrderMediaOverlay(zOrderMediaOverlay);
        }else{
            videoView.neetSetZOrder = true;
        }
    }

    @ReactProp(name = "options")
    public void setOptions(final YoumeVideoView videoView, final ReadableMap options) {

        String userID    = options.hasKey("userID")   ? options.getString("userID") : "";
        //停止在最后一帧画面
        boolean pause    = options.hasKey("pause")    ? options.getBoolean("pause") : false;
        //隐藏视频组件显示，如果全部都隐藏了，同时会屏蔽视频流接受
        boolean hide     = options.hasKey("hide")     ? options.getBoolean("hide") : false;
        //在组件销毁时自动屏蔽视频接受
        boolean autoMask = options.hasKey("autoMask") ? options.getBoolean("autoMask") : false;
        int     bgColor  = options.hasKey("bgColor")  ? options.getInt("bgColor") : 0;
        //接收高清或者低清的流
        if(options.hasKey("hd") && !userID.equals(YoumeManager.getInstance().getLocalUserId())){
            boolean hd = options.getBoolean("hd");
            setUsersVideoInfo(videoView, userID, hd ? 0 : 1);
        }

        Log.d(REACT_COMPONENT_NAME, "setOptions:"+currentCount+ " " + userID + " pause:" + pause + " hide:" + hide + " color:"+bgColor);
        if (userID == null) return;
        if (videoView.surfaceView != null) {
            if (!userID.equals(videoView.userid)) {
                YoumeManager.getInstance().deleteRenderInfo(videoView.userid, videoView.renderInfo);
                videoView.removeView();
                videoView.renderInfo = YoumeManager.getInstance().addRenderInfo(userID);
                videoView.addView(videoView.renderInfo, userID, bgColor);
                setZOrderMediaOverlay(videoView, videoView.zOrderMediaOverlay);
            }
        }
        else {
            videoView.renderInfo = YoumeManager.getInstance().addRenderInfo(userID);
            videoView.addView(videoView.renderInfo, userID, bgColor);
        }
        videoView.setPause(pause);
        videoView.setHide(hide);
        if(userID.indexOf("_share") == userID.length() - 6){
            Log.d(REACT_COMPONENT_NAME, "unmask:"+ userID.substring(0,userID.length() - 6));
            api.maskVideoByUserId(userID.substring(0,userID.length() - 6), false);
        }else{
            api.maskVideoByUserId(userID, false);
        }


        videoView.setAutoMask(autoMask);
        if(videoView.neetSetZOrder){
            videoView.neetSetZOrder = false;
            setZOrderMediaOverlay(videoView, videoView.zOrderMediaOverlay);
        }
    }

    @Override//销毁实例
    public void onDropViewInstance(YoumeVideoView videoView) {
        Log.d(REACT_COMPONENT_NAME, "onDropViewInstance："+ currentCount + " "+ (videoView.userid != null ? videoView.userid:""));
        if(videoView.userid != null) {
            YoumeManager.getInstance().deleteRenderInfo(videoView.userid, videoView.renderInfo);

            Vector<SurfaceViewRenderer> renderInfos = VideoRendererManager.getInstance().getRender(videoView.userid);
            if(videoView.autoMask &&(renderInfos == null || renderInfos.size() == 0)) {
                if(YoumeManager.getInstance().currentShareUserId.equals( videoView.userid)) {
                }else{
                    Log.d(REACT_COMPONENT_NAME, "mask userid:" + videoView.userid);
                    api.maskVideoByUserId(videoView.userid, true);
                }
            }
        }
        super.onDropViewInstance(videoView);
    }

    static ArrayList<String> userIds =  new ArrayList<>();
    static ArrayList<Integer> streamIds = new ArrayList<>();
    static private void setUsersVideoInfo(YoumeVideoView view, final String userid, final int streamId)
    {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                api.setUsersVideoInfo(new String[]{userid}, new int[]{streamId});
            }
        }, 120);
        /** 合并请求，减少delay，不过由于实测view组件每个创建有20ms左右的间隔，太大，不合并了
        userIds.add(userid);
        streamIds.add(streamId);
        Log.d(TAG,"enter setUsersVideoInfo");
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "setUsersVideoInfo:"+userIds.size() +" "+ streamIds.size());
                if (userIds.size() > 0 && streamIds.size() == userIds.size()) {
                    int[] ids = new int[streamIds.size()];
                    for (int i = 0; i < ids.length; i++) {
                        ids[i] = (int) streamIds.get(i);
                    }
                    api.setUsersVideoInfo(userIds.toArray(new String[0]), ids);
                    userIds.clear();
                    streamIds.clear();
                } else {
                    Log.e(TAG, "setUsersVideoInfo: error");
                }
            }
        }, 5);
         */
    }

}
