package com.youme.video;
import android.content.Context;
import android.os.Looper;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;

import com.youme.voiceengine.api;
import com.youme.voiceengine.video.EglBase;
import com.youme.voiceengine.video.RendererCommon;
import com.youme.voiceengine.video.SurfaceViewRenderer;

public class YoumeVideoView extends PercentFrameLayout {

    public SurfaceViewRenderer surfaceView;
    public String userid;
    public boolean pause;
    public boolean hide;
    public boolean autoMask;
    public VideoRendererManager.RenderInfo renderInfo;
    public boolean zOrderMediaOverlay = false;
    public boolean neetSetZOrder = false;
    private int lastWidth = 0;
    private int lastHeight = 0;
    private int lastVideoWidth = 0;
    private int lastVideoHeight = 0;

    public YoumeVideoView(Context context) {
        super(context);
    }

    public YoumeVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public YoumeVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private boolean isSameDirection(int videoWidth, int videoHeight){
        //判断视频和view的长宽比是否先相同的方向
        Log.d("YoumeVideoView", "view width:"+lastWidth+" height:"+lastHeight+" video width:"+videoWidth +" height:"+videoHeight );
        boolean sameDirecation =  (lastWidth > lastHeight && videoWidth > videoHeight) || (lastWidth < lastHeight && videoWidth < videoHeight);
        if(sameDirecation && lastWidth > lastHeight){
            return false;
        }
        return sameDirecation;
    }

    public void addView(VideoRendererManager.RenderInfo renderInfo, String userid,int bgColor)
    {
        VideoResolution initResolution = YoumeManager.getInstance().getResolution(userid);
        if(isSameDirection(initResolution.width, initResolution.height))
        {
            renderInfo.view.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FILL);
        }else{
            renderInfo.view.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT);
        }
        lastVideoWidth = initResolution.width;
        lastVideoHeight= initResolution.height;


        renderInfo.view.init(EglBase.createContext(api.sharedEGLContext()), new RendererCommon.RendererEvents(){
            @Override
            public void onFirstFrameRendered(final int width,final int height,final int rotation) {
                /*
                post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("SurfaceViewRenderer2", "onFirstFrameRendered setVisibility" );
                        if(surfaceView != null) {
                            if (width > height) {
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT);
                            }
                            else{
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FILL);
                            }
                        }
                        requestLayout();
                    }
                });
                */
            }

            @Override
            public void onFrameResolutionChanged(final int width,final int height,final int rotation) {
                post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("SurfaceViewRenderer2", "onFrameResolutionChanged setVisibility" );
                        if(surfaceView != null) {
                            /*
                            if (width > height) {
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT);
                            }
                            else{
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FILL);
                            }
                            */
                            lastVideoWidth = width;
                            lastVideoHeight= height;
                            if(isSameDirection(lastVideoWidth, lastVideoHeight))
                            {
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FILL);
                            }else{
                                surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT);
                            }
                        }
                        requestLayout();
                    }
                });

            }
        } );

        Log.d("SurfaceViewRenderer2", "new YoumeVideoView" );
        renderInfo.view.setMirror(false);
        renderInfo.view.setRenderBackgroundColor(bgColor & 0xff0000 >> 16 ,bgColor & 0xff00 >> 8,bgColor & 0xff,255);
        //sView.setEnableHardwareScaler(true);
        super.addView(renderInfo.view);
        surfaceView = renderInfo.view;
        this.userid = userid;
        this.renderInfo = renderInfo;
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if(Thread.currentThread() == Looper.getMainLooper().getThread())
        {
            measureAndLayout();
        }
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if(w == h || (w == oldw && h == oldh)) return;
        lastWidth  = w;
        lastHeight = h;
        post(new Runnable() {
            @Override
            public void run() {
                if(surfaceView != null && isSameDirection(lastVideoWidth, lastVideoHeight))
                {
                    surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FILL);
                }else{
                    surfaceView.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT);
                }
                requestLayout();
            }
        });
    }

    public void removeView(){
        if(surfaceView != null) {
            super.removeView(surfaceView);
            surfaceView = null;
        }
    }

    private void measureAndLayout () {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.AT_MOST),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.AT_MOST));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    public void setPause(boolean pause){
        this.pause = pause;
        if(surfaceView != null) {
            if (this.pause) {
                surfaceView.pauseVideo();
            }
            else{
                surfaceView.setFpsReduction(120);
            }
        }
    }

    public void setHide(boolean hide){
        this.hide = hide;
        if(hide) {
            surfaceView.setVisibility(View.INVISIBLE);
        }
        else{
            surfaceView.setVisibility(View.VISIBLE);
        }
    }

    public void setAutoMask(boolean autoMask){
        this.autoMask = autoMask;
    }
}
