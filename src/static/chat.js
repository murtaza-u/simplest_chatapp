const username = document.querySelector("h1").innerHTML;

const socket = io();
socket.on('connect', () => {
  socket.emit('joined_room', username);
});

const addToBox = msg => {
  const messages = document.getElementById("messages");
  const newMessage = document.createElement('div');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
}

const chatbox = document.querySelector('input');
document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();
  let message = chatbox.value.trim();
  if (message.length) {
    let data = {
      username: username,
      message: message
    };
    socket.emit('new_message', data);
  }
  chatbox.value = "";
  chatbox.focus();
}

socket.on("joined_announcement", (username) => {
  addToBox(`<strong>${username}</strong> joined the chat`);
});

socket.on("broadcast_message", (data) => {
  addToBox(`<strong>${data.username}:</strong> ${data.message}`);
})

const download = (content, name, type) => {
  let file = new Blob([content], {type: type});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.setAttribute("download", name);
  a.click();
}

socket.on("file_received", (data) => {
  if (confirm(`Do you want to download attachment from ${data.username}?`)) {
    download(data.content, data.name, data.type);
  }
  addToBox(`<strong>${data.username}</strong>: Attachment`);
})

const file_input = document.getElementById("file-input")
file_input.onchange = e => {
  let file = e.target.files[0];

  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = readerEvent => {
    let data = {
      content: readerEvent.target.result,
      name: file.name,
      type: file.type,
      username: username,
    }
    socket.emit("file", data);
    addToBox("sending file.....");
  }
}

document.getElementById("btn-open").addEventListener("click", () => {
  file_input.click();
})
