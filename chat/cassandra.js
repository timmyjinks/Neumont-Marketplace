const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const client = new cassandra.Client({
  contactPoints: ['cassandra'],
  localDataCenter: 'datacenter1',
  keyspace: 'market_chat'        
});

const addChat = async (client, name, participants) => {
  const chatId = uuidv4();
  const createdAt = new Date();

  const participantUUIDs = participants.map(idStr => cassandra.types.Uuid.fromString(idStr));

  const query = `
    INSERT INTO market_chat.chats (chat_id, name, participants, created_at)
    VALUES (?, ?, ?, ?);
  `;

  try {
    await client.execute(query, [cassandra.types.Uuid.fromString(chatId), name, participantUUIDs, createdAt], { prepare: true });
    console.log(`Chat created with id: ${chatId}`);
    return chatId;
  } catch (err) {
    console.error('Failed to create chat:', err);
    throw err;
  }
};

const addMessage= async (client,uuid, content, chat_id) => {
  const createdAt = new Date();
  const query = `
    INSERT INTO market_chat.messages (chat_id, message_time, from_user, content,read)
    VALUES (?, ?, ?, ?);
  `;
  try {
    await client.execute(query, [cassandra.types.Uuid.fromString(chat_id), createdAt,cassandra.types.Uuid.fromString(uuid), content,false ], { prepare: true });
    console.log(`Chat created with id: ${chatId}`);
    return chatId;
  } catch (err) {
    console.error('Failed to create chat:', err);
    throw err;
  }
};


module.exports = { client, addChat,addMessage };
