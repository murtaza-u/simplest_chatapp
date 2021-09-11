const addToBox = msg => {
  const messages = document.getElementById("messages");
  const newMessage = document.createElement('div');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
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
