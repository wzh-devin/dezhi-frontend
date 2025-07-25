# 多阶段构建 - 构建阶段
FROM registry.cn-hangzhou.aliyuncs.com/wzh-devin/node:20.18.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json
COPY package.json ./

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段 - nginx
FROM registry.cn-hangzhou.aliyuncs.com/wzh-devin/nginx:1.24-alpine

# 安装envsubst工具（用于环境变量替换）
RUN apk add --no-cache gettext

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 从构建阶段复制构建产物到nginx静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 13002

# 设置默认的后端API地址，启动nginx
CMD ["/bin/sh", "-c", "export BACKEND_API_URL=${BACKEND_API_URL:-http://localhost:8080} && envsubst '$$BACKEND_API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
