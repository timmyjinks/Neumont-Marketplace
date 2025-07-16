const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], 
  localDataCenter: 'MyMacM3', 
  keyspace: 'chat_app' 
});

module.exports = client;
