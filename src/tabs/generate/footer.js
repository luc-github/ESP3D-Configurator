/*
 index.js - ESP3D WebUI navigation tab file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { h } from "preact"
const footer =
    '\n\
\n\
\n/************************************\n\
*\n\
* Development setting \n\
* Do not modify them for production \n\
************************************/\n\
\n\
//Enable debug mode\n\
//Do not do this when connected to printer !!!\n\
//be noted all upload may failed if enabled\n\
//DEBUG_OUTPUT_SERIAL0\n\
//DEBUG_OUTPUT_SERIAL1\n\
//DEBUG_OUTPUT_SERIAL2\n\
//DEBUG_OUTPUT_TELNET\n\
//DEBUG_OUTPUT_WEBSOCKET\n\
//#define ESP_DEBUG_FEATURE DEBUG_OUTPUT_SERIAL0\n\
\n\
#ifdef ESP_DEBUG_FEATURE\n\
#define DEBUG_BAUDRATE 115200\n\
#define DEBUG_ESP3D_OUTPUT_PORT  8000\n\
#endif //ESP_DEBUG_FEATURE\n\
\n\
//Enable benchmark report in dev console\n\
//#define ESP_BENCHMARK_FEATURE\n\
\n\
//Disable sanity check at compilation\n\
//#define ESP_NO_SANITY_CHECK\n\
\n\
\n/************************************\n\
*\n\
* Sanity checks \n\
* Do not modify \n\
************************************/\n\
\n\
#if defined (SD_TIMESTAMP_FEATURE) || defined (FILESYSTEM_TIMESTAMP_FEATURE)\n\
    #define TIMESTAMP_FEATURE true\n\
#endif //SD_TIMESTAMP_FEATURE || FILESYSTEM_TIMESTAMP_FEATURE \n\
\n\
#if defined(PRINTER_HAS_DISPLAY)\n\
#define HAS_SERIAL_DISPLAY ""\n\
#endif // PRINTER_HAS_DISPLAY\n\
\n\
#if defined(CAMERA_DEVICE)\n\
#if CAMERA_DEVICE==CAMERA_MODEL_ESP32_CAM_BOARD || CAMERA_DEVICE==CAMERA_MODEL_ESP32S2_CAM_BOARD\n\
#define USE_BOARD_HEARDER 1\n\
#endif // CAMERA_DEVICE==CAMERA_MODEL_ESP32_CAM_BOARD || CAMERA_DEVICE==CAMERA_MODEL_ESP32S2_CAM_BOARD\n\
#endif // CAMERA_DEVICE\n\
\n\
#if !defined(WIFI_FEATURE) && !defined(ETH_FEATURE)\n\
#undef HTTP_FEATURE\n\
#undef TELNET_FEATURE\n\
#undef WEBDAV_FEATURE\n\
#undef FTP_FEATURE\n\
#undef WEB_UPDATE_FEATURE\n\
#undef CAPTIVE_PORTAL_FEATURE\n\
#undef SSDP_FEATURE\n\
#undef MDNS_FEATURE\n\
#undef NOTIFICATION_FEATURE\n\
#endif\n\
\n\
#endif //_CONFIGURATION_H\n\
'
export default footer
