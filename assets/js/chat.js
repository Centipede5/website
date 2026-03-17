document.addEventListener('DOMContentLoaded', function () {
  const _0x59602d = _0x5126; (function (_0x576a51, _0x98fdbd) { const _0x102606 = _0x5126, _0x6d292 = _0x576a51(); while (!![]) { try { const _0x5ce1e1 = -parseInt(_0x102606(0x136)) / 0x1 * (parseInt(_0x102606(0x137)) / 0x2) + parseInt(_0x102606(0x13a)) / 0x3 * (-parseInt(_0x102606(0x130)) / 0x4) + -parseInt(_0x102606(0x135)) / 0x5 * (-parseInt(_0x102606(0x131)) / 0x6) + parseInt(_0x102606(0x134)) / 0x7 + -parseInt(_0x102606(0x139)) / 0x8 * (parseInt(_0x102606(0x133)) / 0x9) + parseInt(_0x102606(0x13b)) / 0xa + parseInt(_0x102606(0x132)) / 0xb * (parseInt(_0x102606(0x138)) / 0xc); if (_0x5ce1e1 === _0x98fdbd) break; else _0x6d292['push'](_0x6d292['shift']()); } catch (_0x3afbf7) { _0x6d292['push'](_0x6d292['shift']()); } } }(_0xbde8, 0xc4187)); function _0xbde8() { const _0x3eb471 = ['AIzaSyCSTZLdIGLrreu1viWi-Nt4YNLXmfNOR88', '1112Ewoojb', '7462422BNDzOJ', '11MxeLpz', '9mGcydZ', '6920830ERndRa', '5UdNmkp', '1243HaRIpU', '682QOtMrn', '2513664DapbDB', '8705848sCLMxL', '13803bNdYQI', '11524800UfLxgh']; _0xbde8 = function () { return _0x3eb471; }; return _0xbde8(); } function _0x5126(_0x2c9140, _0xe62ca3) { _0x2c9140 = _0x2c9140 - 0x130; const _0xbde8eb = _0xbde8(); let _0x51260b = _0xbde8eb[_0x2c9140]; return _0x51260b; } const geminiApiKey = _0x59602d(0x13c);
  const chatModalEl = document.getElementById('chatModal');
  if (!chatModalEl) return;
  const chatModal = new bootstrap.Modal(chatModalEl);

  const heroChatInput = document.getElementById('hero-chat-input');
  const heroChatSubmit = document.querySelector('.hero-chat-submit');

  const modalChatInput = document.getElementById('modalChatInput');
  const modalChatSubmit = document.getElementById('modalChatSubmit');
  const chatMessages = document.getElementById('chatMessages');

  // Open modal and optionally run search
  function openChat(initialQuery) {
    chatModal.show();
    setTimeout(() => {
      modalChatInput.focus();
      if (initialQuery) {
        modalChatInput.value = initialQuery;
        handleQuerySubmit(initialQuery);
      }
    }, 500); // Wait for modal animation
  }

  // Bind hero search bar
  if (heroChatInput && heroChatSubmit) {
    heroChatSubmit.addEventListener('click', () => {
      const q = heroChatInput.value.trim();
      heroChatInput.value = '';
      if (q) openChat(q);
      else openChat();
    });

    heroChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = heroChatInput.value.trim();
        heroChatInput.value = '';
        if (q) openChat(q);
        else openChat();
      }
    });
  }

  // Bind modal search bar
  modalChatSubmit.addEventListener('click', () => {
    const q = modalChatInput.value.trim();
    if (q) handleQuerySubmit(q);
  });

  modalChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = modalChatInput.value.trim();
      if (q) handleQuerySubmit(q);
    }
  });

  function addMessage(text, isUser) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
    wrapper.appendChild(bubble);

    const updateContent = (newText) => {
      // Convert basic markdown to HTML
      let htmlText = newText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-accent">$1</a>')
        .replace(/\n/g, '<br>');
      bubble.innerHTML = htmlText;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    updateContent(text);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return { wrapper, updateContent };
  }

  function addLoadingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message bot-message loading-indicator';
    wrapper.innerHTML = `<div class="message-bubble bot-bubble typing-dots"><span>.</span><span>.</span><span>.</span></div>`;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return wrapper;
  }

  let messages = [];

  async function streamGeminiAPI(userQuery, onUpdate) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${geminiApiKey}`;

    const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const systemPrompt = `You are an AI assistant representing Calvin Ristad on his portfolio website.
Your goal is to answer visitor questions accurately and enthusiastically based ONLY on the provided context.
If a user asks a technical question or queries about what Calvin can do, use the context to showcase his skills and make him sound highly capable, experienced, and a great asset to any team.
Highlight his real-world shipped projects, his grant funding, and his technical expertise in software, AI, and hardware. Do not invent information that is not in the context.`;

    const fullPrompt = `${systemPrompt}\n\nContext:\n${window.context}\n\nRecent Conversation:\n${conversationHistory}\nUser: ${userQuery}\nAssistant:`;

    const payload = {
      contents: [{ parts: [{ text: fullPrompt }] }]
    };

    let delay = 1000;
    let response;
    for (let i = 0; i < 5; i++) {
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        break;
      } catch (err) {
        if (i === 4) throw err;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let partialData = "";
    let fullText = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        partialData += chunk;
        const lines = partialData.split('\n');
        partialData = lines.pop(); // Keep the last incomplete line
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr.trim() || dataStr.trim() === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                fullText += textChunk;
                onUpdate(fullText);
              }
            } catch (err) {
              console.error("Error parsing stream chunk:", err, dataStr);
            }
          }
        }
      }
    }
    return fullText;
  }

  async function handleQuerySubmit(query) {
    if (!query) return;

    modalChatInput.value = '';
    // Call addMessage, disregarding the updater since it's a fixed user message
    addMessage(query, true);

    const loadingEl = addLoadingIndicator();

    try {
      let isFirstChunk = true;
      let messageUpdater = null;

      const answer = await streamGeminiAPI(query, (text) => {
        if (isFirstChunk) {
          loadingEl.remove();
          messageUpdater = addMessage(text, false).updateContent;
          isFirstChunk = false;
        } else {
          messageUpdater(text);
        }
      });

      if (isFirstChunk) {
        loadingEl.remove();
        addMessage(answer || "", false);
      }

      messages.push({ role: 'user', content: query });
      messages.push({ role: 'assistant', content: answer || "" });
    } catch (err) {
      console.error(err);
      loadingEl.remove();
      addMessage("Sorry, I encountered an error connecting to my AI brain or there was a network error. Please try again later.", false);
    }
  }
});
