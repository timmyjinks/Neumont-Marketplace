'use client';

import { useEffect, useState } from 'react';
import { validate as isUuid, version as uuidVersion } from 'uuid';
import Chat from './components/chat'; // Adjust path if needed

export default function Home() {
  const [userUuid, setUserUuid] = useState(null); // Initialize as null
  const [otherUuid, setOtherUuid] = useState('');
  const [createError, setCreateError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdChatId, setCreatedChatId] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10101';

  // Validate v4 UUID
  const isValidV4Uuid = (id) => isUuid(id) && uuidVersion(id) === 4;

  // Initialize userUuid
  useEffect(() => {
    if (userUuid && isValidV4Uuid(userUuid)) {
      console.log('userUuid already set:', userUuid);
      return;
    }

    const storedUuid = localStorage.getItem('userUuid');
    if (storedUuid && isValidV4Uuid(storedUuid)) {
      console.log('Loaded valid v4 UUID from localStorage:', storedUuid);
      setUserUuid(storedUuid);
    } else {
      if (storedUuid) {
        console.warn('Invalid or non-v4 UUID in localStorage, clearing:', storedUuid);
        localStorage.removeItem('userUuid');
      }
      const newUuid = crypto.randomUUID(); // Generates v4 UUID
      console.log('Generated new v4 UUID:', newUuid);
      setUserUuid(newUuid);
      localStorage.setItem('userUuid', newUuid);
    }
  }, [userUuid]);

  // Check if a chat with the same participants exists
  const checkExistingChat = async () => {
    if (!userUuid || !isValidV4Uuid(userUuid)) {
      throw new Error('Invalid user UUID');
    }
    try {
      console.log('Checking existing chats for userUuid:', userUuid);
      const response = await fetch(`${apiBaseUrl}/chat?userId=${encodeURIComponent(userUuid)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch chats');
      }
      const chats = await response.json();
      const participantsSet = new Set([userUuid, otherUuid].map(id => id.toLowerCase()));
      return chats.find(chat => {
        const chatParticipants = new Set(chat.participants.map(id => id.toLowerCase()));
        return (
          chatParticipants.size === participantsSet.size &&
          [...participantsSet].every(id => chatParticipants.has(id))
        );
      });
    } catch (err) {
      console.error('Error checking existing chats:', err);
      return null;
    }
  };

  // Enable create chat only if UUIDs are valid v4 and different
  const canCreateChat =
    userUuid &&
    isValidV4Uuid(userUuid) &&
    isValidV4Uuid(otherUuid) &&
    userUuid.toLowerCase() !== otherUuid.toLowerCase();

  const handleCreateChat = async () => {
    setIsCreating(true);
    setCreateError(null);
    setCreatedChatId(null);

    try {
      const existingChat = await checkExistingChat();
      if (existingChat) {
        setCreatedChatId(existingChat.chat_id);
        setCreateError(`Chat already exists with ID: ${existingChat.chat_id}`);
        setOtherUuid('');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Chat with ${otherUuid.substring(0, 8)}`,
          participants: [userUuid, otherUuid],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to create chat: ${response.statusText}`);
      }

      const data = await response.json();
      setCreatedChatId(data.chat_id);
      setOtherUuid('');
    } catch (err) {
      console.error('Error creating chat:', err);
      setCreateError(err.message || 'Failed to create chat. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Setup</h1>

      <label htmlFor="yourId" className="block mb-2 font-semibold">
        Your User ID
      </label>
      <input
        id="yourId"
        type="text"
        value={userUuid || 'Generating UUID...'}
        readOnly
        className="w-full p-2 border rounded mb-4 bg-gray-100 cursor-not-allowed"
      />

      <label htmlFor="otherId" className="block mb-2 font-semibold">
        Other User ID
      </label>
      <input
        id="otherId"
        type="text"
        placeholder="Paste another user UUID"
        value={otherUuid}
        onChange={(e) => setOtherUuid(e.target.value.trim())}
        className="w-full p-2 border rounded mb-4 disabled:opacity-50"
        disabled={isCreating}
      />
      {!isValidV4Uuid(otherUuid) && otherUuid.length > 0 && (
        <p className="text-red-600 mb-4">Invalid v4 UUID format for other user ID.</p>
      )}
      {userUuid &&
        userUuid.toLowerCase() === otherUuid.toLowerCase() &&
        otherUuid.length > 0 && (
          <p className="text-red-600 mb-4">Your ID and Other User ID must be different.</p>
        )}

      {canCreateChat && (
        <button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
        >
          {isCreating ? 'Creating Chat...' : 'Create Chat'}
        </button>
      )}

      {createError && (
        <p className="text-red-600 mb-4">Error: {createError}</p>
      )}

      {createdChatId && !createError && (
        <p className="text-green-700 mb-4">
          Chat created successfully! Chat ID: <code>{createdChatId}</code>
        </p>
      )}

      {userUuid && isValidV4Uuid(userUuid) && (
        <Chat userUuid={userUuid} createdChatId={createdChatId} />
      )}
    </div>
  );
}