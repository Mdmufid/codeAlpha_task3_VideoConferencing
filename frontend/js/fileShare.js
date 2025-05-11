const fileInput = document.getElementById('fileInput');
const sharedFiles = document.getElementById('sharedFiles');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result;
    const fileData = {
      name: file.name,
      type: file.type,
      buffer: Array.from(new Uint8Array(arrayBuffer))
    };
    socket.emit('file-share', fileData);
  };
  reader.readAsArrayBuffer(file);
});

socket.on('file-share', ({ name, type, buffer }) => {
  const blob = new Blob([new Uint8Array(buffer)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.textContent = `Download ${name}`;
  sharedFiles.appendChild(link);
  sharedFiles.appendChild(document.createElement('br'));
});
