var jsonMap = {
    "SSID": "",
    "Key": ""
};
function submitF() {
    LAPI_FormToCfg("frmSetup", jsonMap);
    LAPI_SetCfgData(LAPI_URL.SoftAp, jsonMap, false);
}
