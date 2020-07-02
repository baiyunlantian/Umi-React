FROM nginx:latest
COPY dist /usr/share/nginx/html/wisdom-campus/
COPY ./default.conf /etc/nginx/conf.d/
# 指定容器需要映射到主机的端口
EXPOSE 80
