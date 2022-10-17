<template>
  <div v-drag="'.vac-container-scroll'" id="uranus-game-chat">
    <chat-window
      :current-user-id="currentUserId"
      :rooms="rooms"
      :messages="messages"
      :show-audio="false"
      :show-files="false"
      single-room
      :messageActions="[]"
      :menu-actions="[
        {
          name: 'close',
          title: 'Close',
        },
      ]"
      @send-message="sendMessage"
      @menu-action-handler="menuActionHandler"
      :styles="{
        header: {
          colorRoomName: '#fff',
          colorRoomInfo: '#fff',
        },
        emoji: {
          background: '#92a7d4',
        },
        message: {
          backgroundMe: '#829bdb',
          colorTimestamp: '#000',
        },
        icons: {
          send: '#fff',
          sendDisabled: '#ccc',
          emoji: '#fff',
          menu: '#fff',
        },
      }"
    />
  </div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';

export default {
  name: 'UranusMultiplayerChat',
  components: {
    ChatWindow,
  },
  data() {
    return {
      rooms: [
        {
          roomId: 1,
          roomName: 'Chat',
          users: [
            {
              _id: 1,
              username: 'John Doe',
            },
            {
              _id: 2,
              username: 'John Doe2',
            },
            {
              _id: 3,
              username: 'John Doe3',
            },
          ],
        },
      ],
      messages: [],
      currentUserId: 1,
      currentUsername: 'Noone',
    };
  },
  mounted() {
    const pc = window.pc;

    // --- event: sendMessage
    if (pc) {
      pc.app.on('UranusMultiplayerChat:messageReceived', this.messageReceived, this);
    } else {
      window.UranusMultiplayerChat_messageReceived = this.messageReceived.bind(this);
    }

    // --- event: setUser
    if (pc) {
      pc.app.on('UranusMultiplayerChat:setCurrentUser', this.setCurrentUser, this);
    } else {
      window.UranusMultiplayerChat_setCurrentUser = this.setCurrentUser.bind(this);
    }

    // --- event: setUser
    if (pc) {
      pc.app.on('UranusMultiplayerChat:resetMessages', this.resetMessages, this);
    } else {
      window.UranusMultiplayerChat_resetMessages = this.resetMessages.bind(this);
    }

    // --- fire ready to parent page
    if (pc) {
      pc.app.fire('UranusMultiplayerChat:ready');
    }
  },
  methods: {
    messageReceived(data) {
      const message = {
        _id: this.messages.length,
        content: data.content,
        senderId: data.senderId,
        username: data.username,
        timestamp: new Date().toString().substring(16, 21),
        date: new Date().toDateString(),
      };
      this.$set(this.messages, message._id, message);
    },
    setCurrentUser(data) {
      this.currentUserId = data.userId;
      this.currentUsername = data.username;
    },
    resetMessages() {
      this.messages = [];
    },
    sendMessage(message) {
      const pc = window.pc;

      if (pc) {
        pc.app.fire('UranusMultiplayerChat:sendMessage', {
          content: message.content,
        });
      }

      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
        },
      ];
    },
    menuActionHandler({ action }) {
      const pc = window.pc;
      switch (action.name) {
        case 'close':
          if (pc) {
            pc.app.fire('UranusMultiplayerChat:close');
          }
          break;
      }
    },
  },
};
</script>

<style>
#uranus-game-chat {
  position: absolute;
  /* background-color: hsl(0deg 0% 42% / 50%); */
  background: rgb(24, 61, 138);
  background: linear-gradient(0deg, rgba(24, 61, 138, 0.65) 0%, rgba(146, 167, 212, 0.65) 100%);
}
#uranus-game-chat .vac-card-window {
  font-family: 'Quicksand', sans-serif;
  resize: both;
  overflow: auto;
  background-color: transparent !important;
}
#uranus-game-chat .vac-room-header {
  height: 40px;
  border: none;
  background-color: transparent !important;
}
#uranus-game-chat .vac-container-scroll {
  background-color: transparent !important;
  margin-top: 40px;
  margin-right: 0px;
}
#uranus-game-chat .vac-box-footer {
  padding: 5px 8px 5px;
  background-color: transparent !important;
}
#uranus-game-chat .vac-box-footer .vac-svg-button {
  color: white !important;
}
#uranus-game-chat .vac-textarea {
  padding: 6px 8px;
  background-color: rgba(196, 207, 231, 0.65);
  color: #fff;
}
#uranus-game-chat .vac-textarea::placeholder {
  color: rgb(221, 221, 221);
}
#uranus-game-chat #vac-circle {
  display: none !important;
}
#uranus-game-chat .vac-emoji-reaction {
  display: none !important;
}
#uranus-game-chat .vac-text-timestamp {
  font-style: italic;
  opacity: 0.7;
}
</style>
