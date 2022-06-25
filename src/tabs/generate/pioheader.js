/*
 pioheader.js - ESP3D-configurator header for configuration.h file

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
const pioheader =
    "\
; PlatformIO Project Configuration File\n\
;\n\
;   Build options: build flags, source filter\n\
;   Upload options: custom upload port, speed and extra flags\n\
;   Library options: dependencies, extra library storages\n\
;   Advanced options: extra scripting\n\
;\n\
; Please visit documentation for the other options and examples\n\
; https://docs.platformio.org/page/projectconf.html\n\
\n\
[platformio]\n\
src_dir     = esp3d\n\
build_dir   = .pioenvs\n\
lib_dir     = libraries\n\
libdeps_dir = .piolibdeps\n\
data_dir = esp3d/data\n\
"
export default pioheader
