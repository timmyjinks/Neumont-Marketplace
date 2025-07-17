const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['0.0.0.0'], 
  localDataCenter: 'MyMacM3', 
  keyspace: 'chat_app' 
});

module.exports = client;
