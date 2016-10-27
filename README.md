# slice-cli

**生成日常切图所需项目目录(sass|gulp|browser-sync|autoprefixer|base64) 一键产出交付页面**
**本机安装环境依赖: node git**

```
├── js
└── images
└── css
└── sass
└── fonts
└── jpegs
└── psd
└── source_pages
└── view 
```
### 说明:
* sass目录 存放scss样式文件,自动生成平级的css目录
* source_pages目录 存放html视图文件,在这个目录下面,编写html
* view目录 对应source_pages目录自动生成的html文件,执行 slice run,可在浏览器里预览

### 功能:
* 自动添加浏览器私有前缀
* 代码热更新,浏览器自动刷新
* 支持base64,只需在资源引用处加上'?base64'

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
slice run [Project-name]
```


### 指定 slice 配置文件
```
    slice config //显示配置文件路径
    
    slice config -l //显示最新的配置文件内容
    
    slice config -d <file> //重新指定配置文件路径
```
### 产出页面(交付给小伙伴)
```
slice build [Project-name]
```

