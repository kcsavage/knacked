mongo --eval "db.users.remove()" 127.0.0.1:3002/meteor
mongo --eval "db.knacktivity.remove()" 127.0.0.1:3002/meteor
mongoimport -h localhost:3002 --db meteor --collection users --file users.json --journal
mongoimport -h localhost:3002 --db meteor --collection knacktivity --file knacktivity.json --journal

