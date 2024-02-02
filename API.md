"""
This file, `configuration.json`, contains the configuration settings for the application. It is used to store various parameters and options that control the behavior of the application. 

"""
# API

The configuration file is `configuration.json` and it is a JSON file, it contains the configuration settings for the application. It is used to store various parameters and options that control the behavior of the application. It is located in src directory with the following fields:
1 - the tabs: the tabs that are displayed in the application
which are the following:
    - the features tab, the default tab that is displayed when the application is launched, describes the features of the esp board
    - the network tab, the tab that contains the network capabilities of the esp board
    - the filesystem tab, the tab that contains the filesystem capabilities of the esp board
    - the update tab, the tab that contains the update capabilities of the esp board  
    - the devices tab, the tab that contains the connected devices capabilities of the esp board
    - the security tab, the tab that contains the security settings available    
    - the others tab, the tab that contains the other settings available that are not included in the previous tabs  

2 - the tab is a dictionary that contains the following fields:
   - id: the id of the control, it is also used for the dependency between the controls
   - description: the description of the control, it is used to display the control in the application
   - setting: if the control is a setting or not, (true or false), if false it will be set as comment
    - type: the type of the control, it can be one of the following:
         - text: a text input
         - select: a select input
         - boolean: a boolean input
         - group: a group of controls
    - value: the content of the control, that a list of controls or groups of controls

3 - the control is a dictionary that contains the following fields:
    - id: the id of the control, it is also used for the dependency between the controls
    - description: the description of the control, it is used to display the control in the application
    - label: the label of the control, it is used to display the control in the application
    - setting: if the control is a setting or not, (true or false), if false it will be set as comment
     - define: if the control is a definition then set the label of the define
     - type: the type of the control, it can be one of the following:
         - text: a text input
         - select: a select input
         - boolean: a boolean input
         - group: a group of controls
     - depends: the id of the control that the current control depends on and the list of values of the control that the current control depends on (value), or the list of values of the control that the current control do not depends on (notvalue), if value is a text define then need to add also the `\"`` of begining and end of string 

     - value: the content of the control, that a list of controls or groups of controls, if values is -1 it use default value
     - options: if type is select, then the value is a list of options, defined by the following fields:
            - label: the description of the option
            - value: the value of the option
            - depend: the id of the control that the current control depends on and value of the control that the current control depends on
            - help: the help of the option 
     - isport: if the control is a port or not, (true or false), if true it will be set as port, and use the available port list accross all process, no need to set the possible options
     - ispin: if the control is a pin or not, (true or false), if true it will be set as pin, and use the available pin list accross all process, no need to set the possible options
     - usedescforoptions: if the description of the control is used for the options or not, (true or false), if true it will be used for the options, if false it will not be used for the options, so no need to repeat the description in the options
     -  disableiffalse: disable the control for the configuration if the value of the control is false
      
