D:
cd D:\Projects\Programming\mclib
set tmpbackfld=%date%-%time%
set tmpbackfld=%tmpbackfld:\=%
set tmpbackfld=%tmpbackfld:/=%
set tmpbackfld=%tmpbackfld::=%
set tmpbackfld=%tmpbackfld:.=%
set tmpbackfld=%tmpbackfld: =%
mkdir "backup\%tmpbackfld%"
xcopy *.* backup\"%tmpbackfld%"\*.* 
set tmpbackfld=
del build\doc\*.* /q
call yuidoc -c docbuild.json
call jshint mclib.js > build\errors.txt
call "C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar yuicompressor-2.4.7.jar -o build\mclibmin.js mclib.js
pause
