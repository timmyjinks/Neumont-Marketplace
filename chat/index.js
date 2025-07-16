const express = require('express');
const app = express();
const port = 10101;

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
