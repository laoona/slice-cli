# slice-cli

**切图仔的日常 - 生成日常切图所需项目目录 本机安装环境依赖: node git**

```
├── src
│   ├── js
│   └── images
│   └── scss
│   └── fonts
│   └── jpegs
│   └── psd
│   └── source_pages
│   └── view 
```

### 使用方法
```
npm install slice-cli -g
```


### 初始化项目
```
slice init
```

### 选择一个项目模板
目前只有针对两种不同客户端的模板(手机移动端和传统pc端)
* touch
* pc
    
### 进入项目目录    
```
cd  your project_name
```

### install
```
npm install
```

```
source_pages //html文件夹目录,页面的添加修改都在此文件夹
view //浏览器中预览的html
```

source_pages 可以包含html代码片断([gulp-file-inlcude](https://github.com/coderhaoxin/gulp-file-include)),例:

```
@@include("common.html"); //包含相对于当前html文件的目录下common.html文件
```   


### 在浏览器里预览
```
npm run server
```

### 产出页面(交付给小伙伴)
```
npm run build
```

