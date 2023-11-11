FROM mongo

COPY . ./
ADD seed.sh /
RUN chmod +x /seed.sh
CMD ./seed.sh