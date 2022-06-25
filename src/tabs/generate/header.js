/*
 header.js - ESP3D-configurator header for configuration.h file

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
const header =
    '\
/*\n\
  configuration.h - ESP3D configuration file\n\
\n\
  Copyright (c) 2014 Luc Lebosse. All rights reserved.\n\
\n\
  This code is free software; you can redistribute it and/or\n\
  modify it under the terms of the GNU Lesser General Public\n\
  License as published by the Free Software Foundation; either\n\
  version 2.1 of the License, or (at your option) any later version.\n\
\n\
  This code is distributed in the hope that it will be useful,\n\
  but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU\n\
  Lesser General Public License for more details.\n\
\n\
  You should have received a copy of the GNU Lesser General Public\n\
  License along with This code; if not, write to the Free Software\n\
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA\n\
*/\n\
#ifndef _CONFIGURATION_H\n\
#define _CONFIGURATION_H\n\
//Setup station as default, use AP mode first if not done\n\
//Note: need both defined to enable it\n\
//Uncomment and edit them to define\n\
//#define STATION_WIFI_SSID "*********"\n\
//#define STATION_WIFI_PASSWORD "*********"\n\
\n\
//You can also use a different config file for SSID/password\n\
//Just save it in same location as this configuration.h\n\
//This file is ignored by github\n\
#if defined __has_include\n\
#  if __has_include ("myconfig.h")\n\
#    include "myconfig.h"\n\
#  endif\n\
#endif\n\
\n\
'

export default header
