const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineTo(x, y);
  ctx.stroke();
  socket.emit('draw', { x, y });
}

// Handle remote drawing
socket.on('draw', ({ x, y }) => {
  ctx.lineTo(x, y);
  ctx.stroke();
});
