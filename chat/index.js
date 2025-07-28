const { client, addChat, addMessage, getChats, getChat, deleteChat, getMessages, updateMessage, getMessage, markMessagesRead } = require('./cassandra');
const express = require('express');
const { validate: isUuid } = require('uuid');
const app = express();
const port = 10101; // Blackjack

app.use(express.json());

// Status check
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running' });
});

// Get all chats
app.get('/chat/', async (req, res) => {
  try {
    const chats = await getChats(client);
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Create a chat
app.post('/chat', async (req, res) => {
  const { name, participants } = req.body;

  // Validate input
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Chat name is required and must be a non-empty string' });
  }
  if (!Array.isArray(participants) || participants.length < 2) {
    return res.status(400).json({ error: 'At least two participants are required' });
  }
  if (!participants.every(id => isUuid(id))) {
    return res.status(400).json({ error: 'All participants must have valid UUIDs' });
  }

  try {
    const chatId = await addChat(client, name.trim(), participants);
    res.status(201).json({ message: `Chat created with ID ${chatId}`, chat_id: chatId });
  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Delete a specific chat
app.delete('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;

  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }

  try {
    await deleteChat(client, chatId);
    res.json({ message: `Chat ${chatId} deleted` });
  } catch (err) {
    console.error(`Error deleting chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// Add a message to a specific chat
app.post('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;
  const { uuid, content } = req.body;

  // Validate input
  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }
  if (!isUuid(uuid)) {
    return res.status(400).json({ error: 'Invalid user UUID' });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Message content is required and must be a non-empty string' });
  }

  try {
    const result = await addMessage(client, uuid, content.trim(), chatId);
    res.status(201).json({ message: `Message added to chat ${chatId}`, ...result });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Get a specific chat
app.get('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;

  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }

  try {
    const chat = await getChat(client, chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (err) {
    console.error(`Error fetching chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Get all messages in a specific chat
app.get('/chat/:chatId/message/', async (req, res) => {
  const { chatId } = req.params;

  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }

  try {
    const messages = await getMessages(client, chatId);
    res.json(messages);
  } catch (err) {
    console.error(`Error fetching messages for chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update a specific message in a chat
app.put('/chat/:chatId/message/:messageId', async (req, res) => {
  const { chatId, messageId } = req.params;
  const { content } = req.body;

  // Validate input
  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }
  if (!isUuid(messageId)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Message content is required and must be a non-empty string' });
  }

  try {
    const updatedMessage = await updateMessage(client, chatId, messageId, content.trim());
    res.json({ message: `Message ${messageId} in chat ${chatId} updated`, ...updatedMessage });
  } catch (err) {
    console.error(`Error updating message ${messageId}:`, err);
    res.status(err.message === 'Message not found' ? 404 : 500).json({ error: err.message });
  }
});

// Get a specific message by global ID
app.get('/message/:messageId', async (req, res) => {
  const { messageId } = req.params;

  if (!isUuid(messageId)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  try {
    const message = await getMessage(client, messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    console.error(`Error fetching message ${messageId}:`, err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Mark all messages in a chat as read
app.post('/chat/:chatId/messages/read', async (req, res) => {
  const { chatId } = req.params;

  if (!isUuid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }

  try {
    await markMessagesRead(client, chatId);
    res.json({ message: `All messages in chat ${chatId} marked as read` });
  } catch (err) {
    console.error(`Error marking messages as read in chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Chat app listening at http://localhost:${port}`);
});