# 使用node:20-alpine作为builder
FROM docker.1ms.run/library/node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 设置基础镜像
FROM docker.1ms.run/library/nginx:latest

# 设置元数据
LABEL maintainer="devin <wzh.devin@gmail.com>"
LABEL author="devin"
LABEL email="wzh.devin@gmail.com"
LABEL version="0.0.1"
LABEL description="Dezhi博客前端"

RUN mkdir -p /app/config
WORKDIR /usr/share/nginx/html
RUN rm -rf ./* && \
    rm -rf /etc/nginx/conf.d/*

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html/

RUN ln -sf /app/config/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["/entrypoint.sh"]