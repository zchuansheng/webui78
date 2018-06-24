@echo off
chcp 65001
d:
set curr_dir=%cd%
set COMPRSR_PATH=D:\workfolder\webui78-git\webui78\09bin\yuicompressor-2.4.7
set COMPRSR_CMD=%COMPRSR_PATH%\build\yuicompressor-2.4.7.jar
set CODE_PATH=D:\workfolder\webui78-git\webui78\01code
set MAIN_PATH=%CODE_PATH%\jquery-webui78
set FILENAME_ALL=webui78.src.js
set BUILD_PATH=%MAIN_PATH%\build
set MAIN_PATH_SRC=%MAIN_PATH%\src\js
set BUILD_JS_PATH=%BUILD_PATH%\webui78\js
set verConfigFile=%MAIN_PATH_SRC%\webui78_config.js
cd  %MAIN_PATH_SRC%
copy /b webui78-commons.js+webui78-webUtil.js+webui78-datagrid.js+webui78-webButton.js+webui78-webTabpanel.js+webui78-webPanel.js+webui78-AccordionMuti.js+webui78-webValidator.js+webui78-webDatepicker.js+webui78-webDialog.js+webui78-webTree.js %FILENAME_ALL%
java -jar %COMPRSR_CMD% --charset utf-8 %FILENAME_ALL% -o %BUILD_JS_PATH%\webui78.min.js
echo 开始设置版本号.........
call %curr_dir%\01_version_up.bat
copy webui78_config.js  %BUILD_JS_PATH%\webui78_config.js
cd  %BUILD_PATH%\webui78\skin\default
echo 压缩css.........
@echo on
@echo ddddd=%cd%
java -jar %COMPRSR_CMD% --type css --charset utf-8 webui78.css -o webui78.min.css
cd %curr_dir%

pause;
