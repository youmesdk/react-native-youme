package com.youme.video;

public class ReactNativeYoumeException extends Exception {

    private int code;

    public ReactNativeYoumeException(String message, final int code) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return this.code;
    }

}
