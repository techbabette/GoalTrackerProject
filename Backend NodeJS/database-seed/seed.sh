#!/bin/bash

echo "Hello, World!"

mongoimport --collection users --file users.json --jsonArray --uri "mongodb://root:root@mongodb:27018/goals?authMechanism=SCRAM-SHA-256" --authenticationDatabase admin

echo "(+) Successfully seeded database"