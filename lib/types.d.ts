import { ViewProps } from "react-native";
/**
 * InitOption for init method
 * @property: string appKey get from http://www.youme.im
 * @property: string secretKey get from http://www.youme.im
 * @property: number region is main server region param, default is 0
 * @property: string regionExt is extension region param, just set if your need special server region, default is ''
 */
export interface InitOption {
    appKey: string;
    secretKey: string;
    region: number;
    regionExt: string;
}
/**
 * JoinOption for joinChannel method
 * @property: string userid can include [0-9a-zA-Z_]+
 * @property: string channel is video chat channel
 * @property: string token is optional
 */
export interface JoinOption {
    userid: string;
    channel: string;
    token: string;
    role: number;
    checkRoomExist?: boolean;
    fps?: number;
    previewWidth?: number;
    previewHeight?: number;
    sendWidth?: number;
    sendHeight?: number;
    secondStreamWidth?: number;
    secondStreamHeight?: number;
    autoRecvStream?: boolean;
    secondStreamFPS?: number;
    VBR?: boolean;
    secondStreamVBR?: boolean;
}
export interface StreamOption {
    userID: string;
    streamID: number;
}
/**
 * JoinOption for joinChannel method
 * @property: string userid can include [0-9a-zA-Z_]+
 * @property: string channel is video chat channel
 * @property: string token is optional
 */
export interface LeaveOption {
}
export interface YoumeViewOptions {
    userID: string;
    pause?: boolean;
    hide?: boolean;
    autoMask: boolean;
    bgColor: number;
}
export interface YoumeViewProps extends ViewProps {
    options: YoumeViewOptions;
    zOrderMediaOverlay: boolean;
    [key: string]: any;
}
export interface MemberList {
    code: number;
    channel: string;
    token: string;
    isUpdate: boolean;
    memberList: {
        userid: string;
        isJoin: boolean;
    };
}
export declare const YOUME_REACT_NATIVE_EVENT: {
    YOUME_ON_EVENT: string;
    YOUME_ON_RESTAPI: string;
    YOUME_ON_MEMBER_CHANGE: string;
    YOUME_ON_STATISTIC_UPDATE: string;
};
export declare enum YOUME_EVENT_TYPE {
    YOUME_EVENT_INIT_OK = 0,
    YOUME_EVENT_INIT_FAILED = 1,
    YOUME_EVENT_JOIN_OK = 2,
    YOUME_EVENT_JOIN_FAILED = 3,
    YOUME_EVENT_LEAVED_ONE = 4,
    YOUME_EVENT_LEAVED_ALL = 5,
    YOUME_EVENT_PAUSED = 6,
    YOUME_EVENT_RESUMED = 7,
    YOUME_EVENT_SPEAK_SUCCESS = 8,
    YOUME_EVENT_SPEAK_FAILED = 9,
    YOUME_EVENT_RECONNECTING = 10,
    YOUME_EVENT_RECONNECTED = 11,
    YOUME_EVENT_REC_PERMISSION_STATUS = 12,
    YOUME_EVENT_BGM_STOPPED = 13,
    YOUME_EVENT_BGM_FAILED = 14,
    YOUME_EVENT_OTHERS_MIC_ON = 16,
    YOUME_EVENT_OTHERS_MIC_OFF = 17,
    YOUME_EVENT_OTHERS_SPEAKER_ON = 18,
    YOUME_EVENT_OTHERS_SPEAKER_OFF = 19,
    YOUME_EVENT_OTHERS_VOICE_ON = 20,
    YOUME_EVENT_OTHERS_VOICE_OFF = 21,
    YOUME_EVENT_MY_MIC_LEVEL = 22,
    YOUME_EVENT_MIC_CTR_ON = 23,
    YOUME_EVENT_MIC_CTR_OFF = 24,
    YOUME_EVENT_SPEAKER_CTR_ON = 25,
    YOUME_EVENT_SPEAKER_CTR_OFF = 26,
    YOUME_EVENT_LISTEN_OTHER_ON = 27,
    YOUME_EVENT_LISTEN_OTHER_OFF = 28,
    YOUME_EVENT_LOCAL_MIC_ON = 29,
    YOUME_EVENT_LOCAL_MIC_OFF = 30,
    YOUME_EVENT_LOCAL_SPEAKER_ON = 31,
    YOUME_EVENT_LOCAL_SPEAKER_OFF = 32,
    YOUME_EVENT_GRABMIC_START_OK = 33,
    YOUME_EVENT_GRABMIC_START_FAILED = 34,
    YOUME_EVENT_GRABMIC_STOP_OK = 35,
    YOUME_EVENT_GRABMIC_STOP_FAILED = 36,
    YOUME_EVENT_GRABMIC_REQUEST_OK = 37,
    YOUME_EVENT_GRABMIC_REQUEST_FAILED = 38,
    YOUME_EVENT_GRABMIC_REQUEST_WAIT = 39,
    YOUME_EVENT_GRABMIC_RELEASE_OK = 40,
    YOUME_EVENT_GRABMIC_RELEASE_FAILED = 41,
    YOUME_EVENT_GRABMIC_ENDMIC = 42,
    YOUME_EVENT_GRABMIC_NOTIFY_START = 43,
    YOUME_EVENT_GRABMIC_NOTIFY_STOP = 44,
    YOUME_EVENT_GRABMIC_NOTIFY_HASMIC = 45,
    YOUME_EVENT_GRABMIC_NOTIFY_NOMIC = 46,
    YOUME_EVENT_INVITEMIC_SETOPT_OK = 47,
    YOUME_EVENT_INVITEMIC_SETOPT_FAILED = 48,
    YOUME_EVENT_INVITEMIC_REQUEST_OK = 49,
    YOUME_EVENT_INVITEMIC_REQUEST_FAILED = 50,
    YOUME_EVENT_INVITEMIC_RESPONSE_OK = 51,
    YOUME_EVENT_INVITEMIC_RESPONSE_FAILED = 52,
    YOUME_EVENT_INVITEMIC_STOP_OK = 53,
    YOUME_EVENT_INVITEMIC_STOP_FAILED = 54,
    YOUME_EVENT_INVITEMIC_CAN_TALK = 55,
    YOUME_EVENT_INVITEMIC_CANNOT_TALK = 56,
    YOUME_EVENT_INVITEMIC_NOTIFY_CALL = 57,
    YOUME_EVENT_INVITEMIC_NOTIFY_ANSWER = 58,
    YOUME_EVENT_INVITEMIC_NOTIFY_CANCEL = 59,
    YOUME_EVENT_SEND_MESSAGE_RESULT = 60,
    YOUME_EVENT_MESSAGE_NOTIFY = 61,
    YOUME_EVENT_KICK_RESULT = 64,
    YOUME_EVENT_KICK_NOTIFY = 65,
    YOUME_EVENT_FAREND_VOICE_LEVEL = 66,
    YOUME_EVENT_OTHERS_BE_KICKED = 67,
    YOUME_EVENT_AUDIO_START_FAIL = 72,
    YOUME_EVENT_AUDIO_INPUT_DEVICE_CONNECT = 73,
    YOUME_EVENT_AUDIO_INPUT_DEVICE_DISCONNECT = 74,
    YOUME_EVENT_SWITCH_OUTPUT = 75,
    YOUME_EVENT_OTHERS_VIDEO_ON = 200,
    YOUME_EVENT_MASK_VIDEO_BY_OTHER_USER = 204,
    YOUME_EVENT_RESUME_VIDEO_BY_OTHER_USER = 205,
    YOUME_EVENT_MASK_VIDEO_FOR_USER = 206,
    YOUME_EVENT_RESUME_VIDEO_FOR_USER = 207,
    YOUME_EVENT_OTHERS_VIDEO_SHUT_DOWN = 208,
    YOUME_EVENT_OTHERS_VIDEO_INPUT_START = 209,
    YOUME_EVENT_OTHERS_VIDEO_INPUT_STOP = 210,
    YOUME_EVENT_MEDIA_DATA_ROAD_PASS = 211,
    YOUME_EVENT_MEDIA_DATA_ROAD_BLOCK = 212,
    YOUME_EVENT_QUERY_USERS_VIDEO_INFO = 213,
    YOUME_EVENT_SET_USERS_VIDEO_INFO = 214,
    YOUME_EVENT_LOCAL_VIDEO_INPUT_START = 215,
    YOUME_EVENT_LOCAL_VIDEO_INPUT_STOP = 216,
    YOUME_EVENT_START_PUSH = 217,
    YOUME_EVENT_SET_PUSH_MIX = 218,
    YOUME_EVENT_ADD_PUSH_MIX_USER = 219,
    YOUME_EVENT_OTHER_SET_PUSH_MIX = 220,
    YOUME_EVENT_LOCAL_SHARE_INPUT_START = 221,
    YOUME_EVENT_LOCAL_SHARE_INPUT_STOP = 222,
    YOUME_EVENT_OTHERS_SHARE_INPUT_START = 223,
    YOUME_EVENT_OTHERS_SHARE_INPUT_STOP = 224,
    YOUME_EVENT_OTHERS_DATA_ERROR = 300,
    YOUME_EVENT_OTHERS_NETWORK_BAD = 301,
    YOUME_EVENT_OTHERS_BLACK_FULL = 302,
    YOUME_EVENT_OTHERS_GREEN_FULL = 303,
    YOUME_EVENT_OTHERS_BLACK_BORDER = 304,
    YOUME_EVENT_OTHERS_GREEN_BORDER = 305,
    YOUME_EVENT_OTHERS_BLURRED_SCREEN = 306,
    YOUME_EVENT_OTHERS_ENCODER_ERROR = 307,
    YOUME_EVENT_OTHERS_DECODER_ERROR = 308,
    YOUME_EVENT_CAMERA_DEVICE_CONNECT = 400,
    YOUME_EVENT_CAMERA_DEVICE_DISCONNECT = 401,
    YOUME_EVENT_EOF = 1000
}
export declare enum YOUME_USER_ROLE {
    YOUME_USER_NONE = 0,
    YOUME_USER_TALKER_FREE = 1,
    YOUME_USER_TALKER_ON_DEMAND = 2,
    YOUME_USER_LISTENER = 3,
    YOUME_USER_COMMANDER = 4,
    YOUME_USER_HOST = 5,
    YOUME_USER_GUSET = 6
}
export declare enum YOUME_ERROR_CODE {
    YOUME_SUCCESS = 0,
    YOUME_ERROR_API_NOT_SUPPORTED = -1,
    YOUME_ERROR_INVALID_PARAM = -2,
    YOUME_ERROR_ALREADY_INIT = -3,
    YOUME_ERROR_NOT_INIT = -4,
    YOUME_ERROR_CHANNEL_EXIST = -5,
    YOUME_ERROR_CHANNEL_NOT_EXIST = -6,
    YOUME_ERROR_WRONG_STATE = -7,
    YOUME_ERROR_NOT_ALLOWED_MOBILE_NETWROK = -8,
    YOUME_ERROR_WRONG_CHANNEL_MODE = -9,
    YOUME_ERROR_TOO_MANY_CHANNELS = -10,
    YOUME_ERROR_TOKEN_ERROR = -11,
    YOUME_ERROR_NOT_IN_CHANNEL = -12,
    YOUME_ERROR_BE_KICK = -13,
    YOUME_ERROR_DEVICE_NOT_VALID = -14,
    YOUME_ERROR_API_NOT_ALLOWED = -15,
    YOUME_ERROR_MEMORY_OUT = -100,
    YOUME_ERROR_START_FAILED = -101,
    YOUME_ERROR_STOP_FAILED = -102,
    YOUME_ERROR_ILLEGAL_SDK = -103,
    YOUME_ERROR_SERVER_INVALID = -104,
    YOUME_ERROR_NETWORK_ERROR = -105,
    YOUME_ERROR_SERVER_INTER_ERROR = -106,
    YOUME_ERROR_QUERY_RESTAPI_FAIL = -107,
    YOUME_ERROR_USER_ABORT = -108,
    YOUME_ERROR_SEND_MESSAGE_FAIL = -109,
    YOUME_ERROR_SET_PUSH_PARAM_FAIL = -110,
    YOUME_ERROR_INIT_SHARE_FAIL = -111,
    YOUME_ERROR_START_SHARE_FAIL = -112,
    YOUME_ERROR_REC_INIT_FAILED = -201,
    YOUME_ERROR_REC_NO_PERMISSION = -202,
    YOUME_ERROR_REC_NO_DATA = -203,
    YOUME_ERROR_REC_OTHERS = -204,
    YOUME_ERROR_REC_PERMISSION_UNDEFINED = -205,
    YOUME_ERROR_GRABMIC_FULL = -301,
    YOUME_ERROR_GRABMIC_HASEND = -302,
    YOUME_ERROR_INVITEMIC_NOUSER = -401,
    YOUME_ERROR_INVITEMIC_OFFLINE = -402,
    YOUME_ERROR_INVITEMIC_REJECT = -403,
    YOUME_ERROR_INVITEMIC_TIMEOUT = -404,
    YOUME_ERROR_CAMERA_OPEN_FAILED = -501,
    YOUME_ERROR_UNKNOWN = -1000
}
export declare enum YOUME_AV_STATISTIC_TYPE {
    YOUME_AVS_AUDIO_CODERATE = 1,
    YOUME_AVS_VIDEO_CODERATE = 2,
    YOUME_AVS_VIDEO_FRAMERATE = 3,
    YOUME_AVS_AUDIO_PACKET_UP_LOSS_RATE = 4,
    YOUME_AVS_AUDIO_PACKET_DOWN_LOSS_RATE = 5,
    YOUME_AVS_VIDEO_PACKET_UP_LOSS_RATE = 6,
    YOUME_AVS_VIDEO_PACKET_DOWN_LOSS_RATE = 7,
    YOUME_AVS_AUDIO_DELAY_MS = 8,
    YOUME_AVS_VIDEO_DELAY_MS = 9,
    YOUME_AVS_VIDEO_BLOCK = 10,
    YOUME_AVS_AUDIO_PACKET_UP_LOSS_HALF = 11,
    YOUME_AVS_VIDEO_PACKET_UP_LOSS_HALF = 12
}