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

  // Convert participants to a Set to match the schema
  const participantUUIDs = new Set(participants.map(idStr => cassandra.types.Uuid.fromString(idStr)));

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

const addMessage = async (client, uuid, content, chat_id) => {
  const messageTime = cassandra.types.TimeUuid.now();
  const messageId = cassandra.types.Uuid.random();

  const query = `
    INSERT INTO market_chat.messages (chat_id, message_time, message_id, from_user, content, read)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  try {
    await client.execute(
      query,
      [
        cassandra.types.Uuid.fromString(chat_id),
        messageTime,
        messageId,
        cassandra.types.Uuid.fromString(uuid),
        content,
        false
      ],
      { prepare: true }
    );

    console.log(`Message added to chat ${chat_id}, message_id: ${messageId}`);
    return { chat_id, message_time: messageTime, message_id: messageId };
  } catch (err) {
    console.error('Failed to add message:', err);
    throw err;
  }
};

const getChats = async (client) => {
  const query = `
    SELECT chat_id, name, participants, created_at 
    FROM market_chat.chats;
  `;

  try {
    const result = await client.execute(query, [], { prepare: true });
    return result.rows;
  } catch (err) {
    console.error('Failed to fetch chats:', err);
    throw err;
  }
};

const getChat = async (client, chatId) => {
  const query = `
    SELECT chat_id, name, participants, created_at 
    FROM market_chat.chats 
    WHERE chat_id = ?;
  `;

  try {
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    return result.rows[0] || null;
  } catch (err) {
    console.error(`Failed to fetch chat ${chatId}:`, err);
    throw err;
  }
};

const deleteChat = async (client, chatId) => {
  const query = `
    DELETE FROM market_chat.chats 
    WHERE chat_id = ?;
  `;

  try {
    await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    // Also delete associated messages
    const messageQuery = `
      DELETE FROM market_chat.messages 
      WHERE chat_id = ?;
    `;
    await client.execute(messageQuery, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    console.log(`Chat ${chatId} deleted`);
  } catch (err) {
    console.error(`Failed to delete chat ${chatId}:`, err);
    throw err;
  }
};

const getMessages = async (client, chatId) => {
  const query = `
    SELECT chat_id, message_time, message_id, from_user, content, read 
    FROM market_chat.messages 
    WHERE chat_id = ?;
  `;

  try {
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    return result.rows;
  } catch (err) {
    console.error(`Failed to fetch messages for chat ${chatId}:`, err);
    throw err;
  }
};

const updateMessage = async (client, chatId, messageId, content) => {
  const query = `
    UPDATE market_chat.messages 
    SET content = ? 
    WHERE chat_id = ? AND message_time = ? AND message_id = ?;
  `;

  try {
    // Fetch message_time for the message_id
    const fetchQuery = `
      SELECT message_time 
      FROM market_chat.messages 
      WHERE chat_id = ? AND message_id = ?;
    `;
    const result = await client.execute(fetchQuery, [cassandra.types.Uuid.fromString(chatId), cassandra.types.Uuid.fromString(messageId)], { prepare: true });
    
    if (!result.rows[0]) {
      throw new Error('Message not found');
    }
    
    const messageTime = result.rows[0].message_time;
    
    await client.execute(
      query,
      [content, cassandra.types.Uuid.fromString(chatId), messageTime, cassandra.types.Uuid.fromString(messageId)],
      { prepare: true }
    );
    console.log(`Message ${messageId} in chat ${chatId} updated`);
    return { chat_id: chatId, message_id: messageId, content };
  } catch (err) {
    console.error(`Failed to update message ${messageId}:`, err);
    throw err;
  }
};

const getMessage = async (client, messageId) => {
  // Note: Querying by message_id alone requires a secondary index or full table scan
  // Assuming a secondary index exists: CREATE INDEX message_id_idx ON market_chat.messages (message_id);
  const query = `
    SELECT chat_id, message_time, message_id, from_user, content, read 
    FROM market_chat.messages 
    WHERE message_id = ?;
  `;

  try {
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(messageId)], { prepare: true });
    return result.rows[0] || null;
  } catch (err) {
    console.error(`Failed to fetch message ${messageId}:`, err);
    throw err;
  }
};

const markMessagesRead = async (client, chatId) => {
  const query = `
    UPDATE market_chat.messages 
    SET read = true 
    WHERE chat_id = ?;
  `;

  try {
    await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    console.log(`Messages in chat ${chatId} marked as read`);
  } catch (err) {
    console.error(`Failed to mark messages as read in chat ${chatId}:`, err);
    throw err;
  }
};

module.exports = {
  client,
  addChat,
  addMessage,
  getChats,
  getChat,
  deleteChat,
  getMessages,
  updateMessage,
  getMessage,
  markMessagesRead
};