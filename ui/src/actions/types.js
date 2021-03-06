/*
    * == USER ACTIONS ==
*/

// [GET] USER INFO
export const FETCH_USER_START = "FETCH_USER_START";
export const FETCH_USER_OK = "FETCH_USER_OK";
export const FETCH_USER_ERR = "FETCH_USER_ERR";

/*
    * == SEARCH ACTIONS ==
*/

// [GET] SEARCH
export const SEARCH_START = "SEARCH_START";
export const SEARCH_OK = "SEARCH_OK";
export const SEARCH_ERR = "SEARCH_ERR";

// [GET] QUICK SEARCH
export const QUICK_SEARCH_START = "QUICK_SEARCH_START";
export const QUICK_SEARCH_OK = "QUICK_SEARCH_OK";
export const QUICK_SEARCH_ERR = "QUICK_SEARCH_ERR";

/*
    * == LIBRARY ACTIONS ==
*/

// [GET] ALL LIBRARIES
export const FETCH_LIBRARIES_START = "FETCH_LIBRARIES_START";
export const FETCH_LIBRARIES_OK = "FETCH_LIBRARIES_OK";
export const FETCH_LIBRARIES_ERR = "FETCH_LIBRARIES_ERR";

// [GET] LIBRARY UNMATCHED
export const FETCH_LIBRARY_UNMATCHED_START = "FETCH_LIBRARY_UNMATCHED_START";
export const FETCH_LIBRARY_UNMATCHED_OK = "FETCH_LIBRARY_UNMATCHED_OK";
export const FETCH_LIBRARY_UNMATCHED_ERR = "FETCH_LIBRARY_UNMATCHED_ERR";

// [GET] LIBRARY INFO
export const FETCH_LIBRARY_INFO = "FETCH_LIBRARY_INFO";

// [GET] LIBRARY MEDIA
export const FETCH_LIBRARY_MEDIA = "FETCH_LIBRARY_MEDIA";

// [POST] NEW LIBRARY
export const NEW_LIBRARY_START = "NEW_LIBRARY_START";
export const NEW_LIBRARY_OK = "NEW_LIBRARY_OK";
export const NEW_LIBRARY_ERR = "NEW_LIBRARY_ERR";

// [DELETE] LIBRARY
export const DEL_LIBRARY_START = "DEL_LIBRARY_START";
export const DEL_LIBRARY_OK = "DEL_LIBRARY_OK";
export const DEL_LIBRARY_ERR = "DEL_LIBRARY_ERR";

// [WEBSOCKET] LIBRARY
export const RM_LIBRARY = "RM_LIBRARY";
export const ADD_LIBRARY = "ADD_LIBRARY";
export const SCAN_START = "SCAN_START";
export const SCAN_STOP = "SCAN_STOP";

/*
    * == CARD ACTIONS ==
*/

// [GET] ALL MEDIA
export const FETCH_CARDS_START = "FETCH_CARDS_START";
export const FETCH_CARDS_OK = "FETCH_CARDS_OK";
export const FETCH_CARDS_ERR = "FETCH_CARDS_ERR";

// [GET] MEDIA INFO
export const FETCH_MEDIA_INFO_START = "FETCH_MEDIA_INFO_START";
export const FETCH_MEDIA_INFO_OK = "FETCH_MEDIA_INFO_OK";
export const FETCH_MEDIA_INFO_ERR = "FETCH_MEDIA_INFO_ERR";
export const FETCH_MEDIA_INFO_CLEAR = "FETCH_MEDIA_INFO_CLEAR";

// [GET] EXTRA MEDIA INFO
export const FETCH_EXTRA_MEDIA_INFO_START = "FETCH_EXTRA_MEDIA_INFO_START";
export const FETCH_EXTRA_MEDIA_INFO_OK = "FETCH_EXTRA_MEDIA_INFO_OK";
export const FETCH_EXTRA_MEDIA_INFO_ERR = "FETCH_EXTRA_MEDIA_INFO_ERR";

// [GET] ALL MEDIA SEASONS
export const FETCH_MEDIA_SEASONS_START = "FETCH_MEDIA_SEASONS_START";
export const FETCH_MEDIA_SEASONS_OK = "FETCH_MEDIA_SEASONS_OK";
export const FETCH_MEDIA_SEASONS_ERR = "FETCH_MEDIA_SEASONS_ERR";

// [GET] MEDIA SEASON EPISODES
export const FETCH_MEDIA_SEASON_EPISODES_START = "FETCH_MEDIA_SEASON_EPISODES_START";
export const FETCH_MEDIA_SEASON_EPISODES_OK = "FETCH_MEDIA_SEASON_EPISODES_OK";
export const FETCH_MEDIA_SEASON_EPISODES_ERR = "FETCH_MEDIA_SEASON_EPISODES_ERR";

/*
    * == DASHBOARD ACTIONS ==
*/

// [GET] DASHBOARD MEDIA
export const FETCH_DASHBOARD_START = "FETCH_DASHBOARD_START";
export const FETCH_DASHBOARD_OK = "FETCH_DASHBOARD_OK";
export const FETCH_DASHBOARD_ERR = "FETCH_DASHBOARD_ERR";

// [GET] DASHBOARD BANNERS
export const FETCH_BANNERS_START = "FETCH_BANNERS_START";
export const FETCH_BANNERS_OK = "FETCH_BANNERS_OK";
export const FETCH_BANNERS_ERR = "FETCH_BANNERS_ERR";

/*
    * == FILEBROWSER ACTIONS ==
*/

export const FETCH_DIRECTORIES_START = "FETCH_DIRECTORIES_START";
export const FETCH_DIRECTORIES_OK = "FETCH_DIRECTORIES_OK";
export const FETCH_DIRECTORIES_ERR = "FETCH_DIRECTORIES_ERR";

/*
    * == VIDEO PLAYER ACTIONS ==
*/

export const TRANSCODE_START = "TRANSCODE_START";
export const TRANSCODE_OK = "TRANSCODE_OK";
export const TRANSCODE_ERR = "TRANSCODE_ERR";

export const DEL_TRANSCODE_START = "DEL_TRANSCODE_START";
export const DEL_TRANSCODE_OK = "DEL_TRANSCODE_OK";
export const DEL_TRANSCODE_ERR = "DEL_TRANSCODE_ERR";

/*
    * AUTH ACTIONS
*/

export const AUTH_LOGIN_START = "AUTH_LOGIN_START";
export const AUTH_LOGIN_OK = "AUTH_LOGIN_OK";
export const AUTH_LOGIN_ERR = "AUTH_LOGIN_ERR";

export const AUTH_UPDATE_TOKEN = "AUTH_UPDATE_TOKEN";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export const AUTH_REGISTER_START = "AUTH_REGISTER_START";
export const AUTH_REGISTER_ERR = "AUTH_REGISTER_ERR";
export const AUTH_REGISTER_OK = "AUTH_REGISTER_OK";

export const AUTH_CHECK_ADMIN_OK = "AUTH_CHECK_ADMIN_OK";
export const AUTH_CHECK_ADMIN_ERR = "AUTH_CHECK_ADMIN_ERR";

export const CREATE_NEW_INVITE_START = "CREATE_NEW_INVITE_START";
export const CREATE_NEW_INVITE_OK = "CREATE_NEW_INVITE_OK";
export const CREATE_NEW_INVITE_ERR = "CREATE_NEW_INVITE_ERR";

export const FETCH_INVITES_START = "FETCH_INVITES_START";
export const FETCH_INVITES_OK = "FETCH_INVITES_OK";
export const FETCH_INVITES_ERR = "FETCH_INVITES_ERR";

/*
    * WS ACTIONS
*/

export const WS_CONNECT_START = "WS_CONNECT_START";
export const WS_CONNECTED = "WS_CONNECTED";
export const WS_CONNECT_ERR = "WS_CONNECT_ERR";

/*
    * VIDEO ACTIONS
*/

export const SET_GID = "SET_GID";
export const SET_MANIFEST_STATE = "SET_MANIFEST_STATE";
export const SET_TRACKS = "SET_TRACKS";
export const UPDATE_TRACK = "UPDATE_TRACK";
export const UPDATE_VIDEO = "UPDATE_VIDEO";
export const SET_SHOW_SUB_SWITCHER = "SET_SHOW_SUB_SWITCHER";
export const CLEAR_VIDEO_DATA = "CLEAR_VIDEO_DATA";
