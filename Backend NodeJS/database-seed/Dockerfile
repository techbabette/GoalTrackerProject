FROM mongo

COPY users.json /users.json
ADD seed.sh /
RUN chmod +x /seed.sh
CMD ./seed.sh