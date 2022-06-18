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
#endif //_CONFIGURATION_H\n\
\n\
#if defined(CAMERA_DEVICE)\n\
#if CAMERA_DEVICE==CAMERA_MODEL_ESP32_CAM_BOARD || CAMERA_DEVICE==CAMERA_MODEL_ESP32S2_CAM_BOARD\n\
#define USE_BOARD_HEARDER 1\n\
#endif // CAMERA_DEVICE==CAMERA_MODEL_ESP32_CAM_BOARD || CAMERA_DEVICE==CAMERA_MODEL_ESP32S2_CAM_BOARD\n\
#endif // CAMERA_DEVICE\n\
'
export default footer
