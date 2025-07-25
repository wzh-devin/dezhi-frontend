# 使用nginx镜像
FROM registry.cn-hangzhou.aliyuncs.com/wzh-devin/nginx:1.24-alpine

# 安装envsubst工具（用于环境变量替换）
RUN apk add --no-cache gettext

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 复制构建好的dist目录到nginx静态文件目录
COPY dist /usr/share/nginx/html

# 暴露端口
EXPOSE 13002

# 启动nginx，使用envsubst处理环境变量
CMD ["/bin/sh", "-c", "envsubst '$$BACKEND_API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
