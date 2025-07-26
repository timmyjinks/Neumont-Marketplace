const { client, addChat } = require('./cassandra');
const express = require('express');
const app = express();
const port = 10101;//Blackjack

// Middleware to parse JSON bodies
app.use(express.json());

// Status check
app.get('/', (req, res) => {

	res.send('Hello World!');
});

//  Get all chats
app.get('/chat/', (req, res) => {
	res.send('All chats loaded.');
});

// Make a Chat
app.post('/chat', (req, res) => {
	const { name, participants } = req.body;

	if (!name || !Array.isArray(participants) || participants.length < 2) {
		return res.status(400).send('Chat name and at least two participants are required.');
	}
	addChat(client, name, participants)
  .then(chatId => res.send(`New chat created with ID ${chatId}`))
  .catch(err => {
    console.error(err);
    res.status(500).send('Error creating chat');
  });
});


// Delete a specific chat
app.delete('/chat/:chatId', (req, res) => {
	const { chatId } = req.params;
	res.send(`Chat ${chatId} deleted.`);
});

// Get a specific chat
app.get('/chat/:chatId', (req, res) => {
	const { chatId } = req.params;
	res.send(`Details for chat ${chatId}.`);
});

// Get all messages in a specific chat
app.get('/chat/:chatId/message/', (req, res) => {
	const { chatId } = req.params;
	res.send(`All messages from chat ${chatId}.`);
});

//  Update a specific message in a chat
app.put('/chat/:chatId/message/:messageId', (req, res) => {
	const { chatId, messageId } = req.params;
	res.send(`Message ${messageId} in chat ${chatId} updated.`);
});

//  Get a specific message by global ID
app.get('/message/:messageId', (req, res) => {
	const { messageId } = req.params;
	res.send(`Details for message ${messageId}.`);
});

//  Mark all messages in a chat as read
app.post('/chat/:chatId/messages/read', (req, res) => {
	const { chatId } = req.params;
	res.send(`All messages in chat ${chatId} marked as read.`);
});

// Start server
app.listen(port, () => {
	console.log(`Chat app listening at http://localhost:${port}`);
});
