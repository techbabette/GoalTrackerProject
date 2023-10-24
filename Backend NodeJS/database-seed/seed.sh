#!/bin/bash

echo "Hello, World!"

ls *.json | sed 's/.metadata.json//' | while read col; do mongoimport --uri "mongodb://root:root@mongodb:27018/goals?authMechanism=SCRAM-SHA-256" --authenticationDatabase admin --jsonArray --file $col; done

echo "(+) Successfully seeded database"