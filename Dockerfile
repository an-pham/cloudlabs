

FROM node:10


WORKDIR /cloudlabs
COPY ./docker_setup.sh ./

EXPOSE 3000
RUN chmod 700 docker_setup.sh
CMD ["./docker_setup.sh"]
