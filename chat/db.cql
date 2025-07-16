DROP KEYSPACE IF EXISTS market_chat;
CREATE KEYSPACE market_chat;

CREATE TABLE messages(

);


-- Message:
-- Time (cassandra time)
-- Content (THE MESSAGE)
-- FromUser (uuid from supabase)
-- ToUser (uuid from supabase)
-- Read (bool)
