const cassandra = require('cassandra-driver');
const { v4: uuidv4, validate: isUuid, version: uuidVersion } = require('uuid');

const client = new cassandra.Client({
  contactPoints: ['0.0.0.0'], 
  localDataCenter: 'MyMacM3', 
  keyspace: 'chat_app' 
});

async function connectClient() {
  try {
    await client.connect();
    console.log('Connected to Cassandra');
  } catch (err) {
    console.error('Failed to connect to Cassandra:', err);
    throw err;
  }
}

async function shutdownClient() {
  try {
    await client.shutdown();
    console.log('Cassandra client shut down');
  } catch (err) {
    console.error('Failed to shut down Cassandra client:', err);
    throw err;
  }
}

async function chatExists(client, chatId) {
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }
  const query = `SELECT chat_id FROM market_chat.chats WHERE chat_id = ?`;
  const result = await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
  return !!result.rows[0];
}

const addChat = async (client, name, participants) => {
  const chatId = uuidv4();
  const createdAt = new Date();

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Chat name is required and must be a non-empty string');
  }
  if (!Array.isArray(participants) || participants.length < 2) {
    throw new Error('At least two participants are required');
  }
  if (!participants.every(id => isUuid(id) && uuidVersion(id) === 4)) {
    throw new Error('All participants must have valid v4 UUIDs');
  }
  if (isNaN(createdAt.getTime())) {
    throw new Error('Invalid createdAt date');
  }

  const participantUUIDs = participants.map(idStr => cassandra.types.Uuid.fromString(idStr));

  const query = `
    INSERT INTO market_chat.chats (chat_id, name, participants, created_at)
    VALUES (?, ?, ?, ?);
  `;

  try {
    await client.execute(
      query,
      [cassandra.types.Uuid.fromString(chatId), name.trim(), participantUUIDs, createdAt],
      { prepare: true }
    );
    console.log(`Chat created with id: ${chatId}, created_at: ${createdAt.toISOString()}`);
    return chatId;
  } catch (err) {
    console.error('Failed to create chat:', err);
    throw err;
  }
};

const addMessage = async (client, uuid, content, chatId) => {
  if (!isUuid(uuid) || uuidVersion(uuid) !== 4) {
    throw new Error('Invalid user UUID, must be a valid v4 UUID');
  }
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    throw new Error('Message content is required and must be a non-empty string');
  }
  if (!(await chatExists(client, chatId))) {
    throw new Error('Chat not found');
  }

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
        cassandra.types.Uuid.fromString(chatId),
        messageTime,
        messageId,
        cassandra.types.Uuid.fromString(uuid),
        content.trim(),
        false
      ],
      { prepare: true }
    );
    console.log(`Message added to chat ${chatId}, message_id: ${messageId}`);
    return { chat_id: chatId, message_time: messageTime, message_id: messageId };
  } catch (err) {
    console.error('Failed to add message:', err);
    throw err;
  }
};

const getChats = async (client, userId) => {
  if (!isUuid(userId) || uuidVersion(userId) !== 4) {
    throw new Error(`Invalid userId format, must be a valid v4 UUID: ${userId}`);
  }

  const query = `
    SELECT chat_id, name, participants, created_at 
    FROM market_chat.chats
    WHERE participants CONTAINS ?
    ALLOW FILTERING;
  `;

  try {
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(userId)], { prepare: true });
    console.log(`Fetched chats for userId: ${userId}, rows:`, result.rows.map(row => ({
      chat_id: row.chat_id,
      name: row.name,
      participants: row.participants,
      created_at: row.created_at ? row.created_at.toISOString() : null
    })));
    return result.rows;
  } catch (err) {
    console.error('Failed to fetch chats for userId:', userId, err);
    throw err;
  }
};

const deleteChat = async (client, chatId) => {
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }
  if (!(await chatExists(client, chatId))) {
    throw new Error('Chat not found');
  }

  const query = `
    DELETE FROM market_chat.chats 
    WHERE chat_id = ?;
  `;

  const messageQuery = `
    DELETE FROM market_chat.messages 
    WHERE chat_id = ?;
  `;

  try {
    await client.execute(query, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    await client.execute(messageQuery, [cassandra.types.Uuid.fromString(chatId)], { prepare: true });
    console.log(`Chat ${chatId} deleted`);
  } catch (err) {
    console.error(`Failed to delete chat ${chatId}:`, err);
    throw err;
  }
};

const getMessages = async (client, chatId) => {
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }
  if (!(await chatExists(client, chatId))) {
    throw new Error('Chat not found');
  }

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
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }
  if (!isUuid(messageId) || uuidVersion(messageId) !== 4) {
    throw new Error('Invalid messageId format, must be a valid v4 UUID');
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    throw new Error('Message content is required and must be a non-empty string');
  }
  if (!(await chatExists(client, chatId))) {
    throw new Error('Chat not found');
  }

  const query = `
    UPDATE market_chat.messages 
    SET content = ? 
    WHERE chat_id = ? AND message_time = ? AND message_id = ?;
  `;

  try {
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
      [content.trim(), cassandra.types.Uuid.fromString(chatId), messageTime, cassandra.types.Uuid.fromString(messageId)],
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
  if (!isUuid(messageId) || uuidVersion(messageId) !== 4) {
    throw new Error('Invalid messageId format, must be a valid v4 UUID');
  }

  const query = `
    SELECT chat_id, message_time, message_id, from_user, content, read 
    FROM market_chat.messages 
    WHERE message_id = ?;
  `;

  try {
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(messageId)], { prepare: true });
    if (!result.rows[0]) {
      throw new Error('Message not found');
    }
    return result.rows[0];
  } catch (err) {
    console.error(`Failed to fetch message ${messageId}:`, err);
    throw err;
  }
};

const markMessagesRead = async (client, chatId) => {
  if (!isUuid(chatId) || uuidVersion(chatId) !== 4) {
    throw new Error('Invalid chatId format, must be a valid v4 UUID');
  }

  if (!(await chatExists(client, chatId))) {
    throw new Error('Chat not found');
  }

  try {
    const messages = await getMessages(client, chatId);

    const batchQueries = messages
      .filter(msg => isUuid(msg.message_id)) // Only include valid UUIDs
      .map(msg => ({
        query: `
          UPDATE market_chat.messages 
          SET read = true 
          WHERE chat_id = ? AND message_time = ? AND message_id = ?;
        `,
        params: [
          Uuid.fromString(chatId),
          msg.message_time,
          Uuid.fromString(msg.message_id)
        ]
      }));

    if (batchQueries.length === 0) {
      console.warn(`No valid messages to update for chat ${chatId}`);
      return;
    }

    await client.batch(batchQueries, { prepare: true });
    console.log(`Messages in chat ${chatId} marked as read`);
  } catch (err) {
    console.error(`Failed to mark messages as read in chat ${chatId}:`, err.stack || err);
    throw err;
  }
};


module.exports = {
  client,
  connectClient,
  shutdownClient,
  addChat,
  addMessage,
  getChats,
  deleteChat,
  getMessages,
  updateMessage,
  getMessage,
  markMessagesRead
};