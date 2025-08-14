import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  customerEmail?: string;
  customerName?: string;
  sessionId: string;
}

class ChatManager {
  private wss: WebSocketServer;
  private activeChats = new Map<string, WebSocket[]>();
  private adminConnections = new Set<WebSocket>();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const sessionId = url.searchParams.get('sessionId') || '';
      const isAdmin = url.searchParams.get('admin') === 'true';

      if (isAdmin) {
        this.adminConnections.add(ws);
        console.log('Admin connected to chat system');
        
        ws.on('close', () => {
          this.adminConnections.delete(ws);
          console.log('Admin disconnected from chat system');
        });

        ws.on('message', (data) => {
          try {
            const message: ChatMessage = JSON.parse(data.toString());
            this.sendToCustomer(message);
          } catch (error) {
            console.error('Invalid admin message:', error);
          }
        });

      } else {
        // Customer connection
        if (!this.activeChats.has(sessionId)) {
          this.activeChats.set(sessionId, []);
        }
        this.activeChats.get(sessionId)!.push(ws);
        
        console.log(`Customer connected: ${sessionId}`);

        ws.on('close', () => {
          const connections = this.activeChats.get(sessionId);
          if (connections) {
            const index = connections.indexOf(ws);
            if (index > -1) {
              connections.splice(index, 1);
            }
            if (connections.length === 0) {
              this.activeChats.delete(sessionId);
            }
          }
          console.log(`Customer disconnected: ${sessionId}`);
        });

        ws.on('message', (data) => {
          try {
            const message: ChatMessage = JSON.parse(data.toString());
            message.sessionId = sessionId;
            this.sendToAdmins(message);
          } catch (error) {
            console.error('Invalid customer message:', error);
          }
        });
      }
    });
  }

  private sendToAdmins(message: ChatMessage) {
    const messageData = JSON.stringify({
      type: 'customer_message',
      data: message
    });

    this.adminConnections.forEach(adminWs => {
      if (adminWs.readyState === WebSocket.OPEN) {
        adminWs.send(messageData);
      }
    });
  }

  private sendToCustomer(message: ChatMessage) {
    const connections = this.activeChats.get(message.sessionId);
    if (connections) {
      const messageData = JSON.stringify({
        type: 'agent_message',
        data: message
      });

      connections.forEach(customerWs => {
        if (customerWs.readyState === WebSocket.OPEN) {
          customerWs.send(messageData);
        }
      });
    }
  }
}

export { ChatManager };