# 前端 fe-space 开发环境搭建指南

## 安装 host 切换工具

>127.0.0.1 baoyide.com

>127.0.0.1 mall.rsscc.cn

>192.168.10.1 gitlab.huoli.com

## 安装 git

## 安装 nginx

### nginx 配置：

nginx.conf

```
server {
    listen 80;
    server_name mall.rsscc.cn baoyide.com;
    index index.php index.html index.htm;
    error_log /var/log/nginx/huoli.error.log;

    gzip on;
    gzip_types text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript image/x-icon image/bmp;
    etag off;

    set $vary 'Accept-Encoding';
    set $cache_control 'no-cache, public, must-revalidate';

    add_header Vary $vary;
    add_header Expires -1;
    add_header Cache-Control  $cache_control;

    location ~ '^/fe/(.*?)(\.__\d*__)(\..*)$' {
        expires 7d;
        alias /Users/tianfangye/repo/huoli/fe-space/dest/$1$3;
    }
    location ~ '^/fe/(.*)$' {
        expires -1;
        alias /Users/tianfangye/repo/huoli/fe-space/dest/$1;
    }
}
```

## 安装 node

## 克隆项目

```shell
git clone http://gitlab.huoli.com/front-end/fe-space.git

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install --global gulp
cnpm install --global webpack
cnpm install -d  
```
