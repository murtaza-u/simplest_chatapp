socket.on("joined_announcement", (username) => {
  const messages = document.getElementById("messages");
  const newMessage = document.createElement('div');
  newMessage.innerHTML = `<strong>${username}</strong> joined the chat`;
  messages.appendChild(newMessage);
});

socket.on("broadcast_message", (data) => {
  const messages = document.getElementById("messages");
  const newMessage = document.createElement('div');
  console.log(data);
  newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  messages.appendChild(newMessage);
})

const download = (content, name, type) => {
  let file = new Blob([content], {type: type});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.setAttribute("download", name);
  a.click();
}

socket.on("file_received", (data) => {
  download(data.content, data.name, data.type);
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
    }
    socket.emit("file", data);
  }
}

document.getElementById("btn-open").addEventListener("click", () => {
  file_input.click();
})
