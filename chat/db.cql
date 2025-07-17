DROP KEYSPACE IF EXISTS market_chat;

CREATE KEYSPACE market_chat WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

CREATE TABLE market_chat.chats (
  chat_id uuid PRIMARY KEY,
  name text,
  participants set<uuid>,
  created_at timestamp
);

CREATE TABLE market_chat.messages (
  chat_id uuid,
  message_time timeuuid,
  from_user uuid,
  content text,
  read boolean,
  PRIMARY KEY (chat_id, message_time)
) WITH CLUSTERING ORDER BY (message_time ASC);
