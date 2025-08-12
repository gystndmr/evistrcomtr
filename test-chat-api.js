// Test chat API functionality
async function testChatAPI() {
  console.log('🔍 Testing Chat API...\n');
  
  try {
    // 1. Test fetching all chat messages
    console.log('1. Testing /api/chat/messages...');
    const messagesResponse = await fetch('http://localhost:5000/api/chat/messages');
    const messages = await messagesResponse.json();
    
    console.log(`   Status: ${messagesResponse.status}`);
    console.log(`   Total messages: ${messages.length}`);
    
    if (messages.length > 0) {
      const sampleMessage = messages[0];
      console.log(`   Sample message fields:`, Object.keys(sampleMessage));
      console.log(`   Sample message: "${sampleMessage.message}" from ${sampleMessage.sender}`);
      console.log(`   Session ID: ${sampleMessage.sessionId}`);
      console.log(`   Is read: ${sampleMessage.isRead}`);
      
      // Group by sessions
      const sessions = {};
      messages.forEach(msg => {
        if (!sessions[msg.sessionId]) {
          sessions[msg.sessionId] = [];
        }
        sessions[msg.sessionId].push(msg);
      });
      
      console.log(`   Unique chat sessions: ${Object.keys(sessions).length}`);
      
      // Show session details
      Object.entries(sessions).slice(0, 3).forEach(([sessionId, sessionMessages], index) => {
        const userMessages = sessionMessages.filter(m => m.sender === 'user');
        const adminMessages = sessionMessages.filter(m => m.sender === 'admin');
        const unreadCount = sessionMessages.filter(m => !m.isRead && m.sender === 'user').length;
        
        console.log(`   Session ${index + 1} (${sessionId}):`);
        console.log(`     - User messages: ${userMessages.length}`);
        console.log(`     - Admin replies: ${adminMessages.length}`);
        console.log(`     - Unread messages: ${unreadCount}`);
        console.log(`     - Customer: ${sessionMessages[0].customerName || 'Website Visitor'}`);
      });
    }
    
    // 2. Test admin reply functionality (if there are sessions)
    if (messages.length > 0) {
      const testSessionId = messages[0].sessionId;
      console.log(`\n2. Testing admin reply to session: ${testSessionId}...`);
      
      const replyResponse = await fetch('http://localhost:5000/api/chat/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: testSessionId,
          message: 'Test admin reply - API functionality test'
        })
      });
      
      console.log(`   Reply Status: ${replyResponse.status}`);
      if (replyResponse.ok) {
        const replyData = await replyResponse.json();
        console.log(`   Reply sent successfully: "${replyData.message}"`);
      }
      
      // 3. Test mark as read functionality
      console.log(`\n3. Testing mark as read for session: ${testSessionId}...`);
      const markReadResponse = await fetch(`http://localhost:5000/api/chat/mark-read/${testSessionId}`, {
        method: 'PATCH'
      });
      
      console.log(`   Mark read Status: ${markReadResponse.status}`);
      if (markReadResponse.ok) {
        const markReadData = await markReadResponse.json();
        console.log(`   ${markReadData.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing chat API:', error);
  }
}

testChatAPI();