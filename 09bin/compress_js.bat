@echo off
d:
set crr=%cd%
set COMPRSR_PATH=D:\workfolder\webui78-git\webui78\09bin\yuicompressor-2.4.7
set COMPRSR_CMD=%COMPRSR_PATH%\build\yuicompressor-2.4.7.jar
set CODE_PATH=D:\workfolder\webui78-git\webui78\01code
set MAIN_PATH=%CODE_PATH%\jquery-webui78
set FILENAME_ALL=webui78.src.js
cd %MAIN_PATH%\src\js
copy /b webui78-commons.js+webui78-webUtil.js+webui78-datagrid.js+webui78-webButton.js+webui78-webTabpanel.js+webui78-webPanel.js+webui78-AccordionMuti.js+webui78-webValidator.js+webui78-webDatepicker.js+webui78-webDialog.js+webui78-webTree.js %FILENAME_ALL%
java -jar %COMPRSR_CMD% --charset utf-8 webui78.all.js -o ../../build/webui78/js/webui78.min.js
copy webui78_config.js  ..\..\build\webui78\js\webui78_config.js
cd  %MAIN_PATH%\build\webui78\skin\default
java -jar %COMPRSR_CMD% --type css --charset utf-8 webui78.css -o webui78.min.css
cd %crr%
pause;
