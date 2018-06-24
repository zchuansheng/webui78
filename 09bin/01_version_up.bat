@ECHO OFF
if not defined curr_dir  set curr_dir=%CD%
if not defined MAIN_PATH  set MAIN_PATH=.
if not defined MAIN_PATH_SRC  set MAIN_PATH_SRC=.

if not defined VERSION_FILE  set VERSION_FILE=%MAIN_PATH_SRC%\version.txt 
 @echo 版本文件位置：%VERSION_FILE%
@echo -----更新版本号
for /f "tokens=2 delims==:" %%i in ('more %VERSION_FILE% ^|findstr /b /i /c:"Major VER"') do set major_ver=%%i
for /f "tokens=2 delims==:" %%i in ('more %VERSION_FILE% ^|findstr /b /i /c:"Minor VER"') do set minor_ver=%%i
for /f "tokens=2 delims==:" %%i in ('more %VERSION_FILE% ^|findstr /b /i /c:"Build VER"') do set build_ver=%%i
if not defined major_ver (  set major_ver=1.0 ) else ( set "major_ver=%major_ver: =%" )
if not defined minor_ver (  set minor_ver=00 ) else ( set "minor_ver=%minor_ver: =%" )
if not defined build_ver (  for /f "tokens=2 delims==:" %%i in ('more %VERSION_FILE% ^|findstr /b /i /c:"Build VER"') do set build_ver=%%i  )
set "build_ver=%build_ver: =%"
@echo 更新前：major_ver=[%major_ver%],minor_ver=[%minor_ver%],build_ver=[%build_ver%]

set /a  build_ver=1%build_ver%-1000
rem @echo 计算后000000：build_ver=%build_ver%
set /a  build_ver=%build_ver%+1
rem @echo 计算后1111111：build_ver=%build_ver%
if  %build_ver% GEQ 900 (
	set /a  minor_ver=1%minor_ver%-100
	set /a  minor_ver=%minor_ver%+1
	set /a  build_ver=1
)
rem @echo 计算后2222：build_ver=%build_ver%
set tmp_len=%minor_ver:~1,1%
if not defined tmp_len  ( 
	set minor_ver=0%minor_ver%
)
rem @echo 补零前：build_ver=%build_ver%
if %build_ver% LSS 10 ( set build_ver=00%build_ver%) else (if %build_ver% LSS 100 ( set build_ver=0%build_ver%) )
 @echo 更新后：major_ver=[%major_ver%],minor_ver=[%minor_ver%],build_ver=[%build_ver%]
set MAIN_VER=%major_ver%.%minor_ver%.%build_ver%
set "MAIN_VER=%MAIN_VER: =%"


@echo Major VER:%major_ver%> %VERSION_FILE%
@echo Minor VER:%minor_ver%>> %VERSION_FILE%
@echo Build VER:%build_ver%>> %VERSION_FILE%
@echo Version:%MAIN_VER%>> %VERSION_FILE%
@echo -----新版本号:%MAIN_VER%
if not defined verConfigFile  set verConfigFile=./webui78_config.js 
if not defined verVarName  set verVarName=$.webUtil.version='
setlocal enabledelayedexpansion  
for /f "tokens=*" %%j in (%verConfigFile%) do (  
    set "tmp=%%j"
    echo "!tmp!" | find /i "%verVarName%">nul && set "tmp=%verVarName%%MAIN_VER%';//version number" && echo 修改版本号变量为!tmp! 
    echo !tmp!>>temp.txt
)  
move temp.txt %verConfigFile%