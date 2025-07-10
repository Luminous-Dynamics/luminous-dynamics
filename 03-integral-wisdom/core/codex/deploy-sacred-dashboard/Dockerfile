FROM nginx:alpine

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy dashboard
COPY index.html /usr/share/nginx/html/

# Ensure nginx can bind to port 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Create non-root user
RUN adduser -D -s /bin/sh www
RUN chown -R www:www /usr/share/nginx/html

EXPOSE 8080

USER www

CMD ["nginx", "-g", "daemon off;"]
