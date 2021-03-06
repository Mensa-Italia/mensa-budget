FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

COPY ./dist/mensa-budget/ .

RUN chmod 777 *

COPY ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
