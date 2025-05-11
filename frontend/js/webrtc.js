// === frontend/js/webrtc.js ===
let localStream;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localStream = stream;
  localVideo.srcObject = stream;
});

function createPeerConnection(userId, isInitiator) {
  const peerConnection = new RTCPeerConnection();
  peerConnections[userId] = peerConnection;

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('signal', {
        to: userId,
        signal: { candidate: event.candidate }
      });
    }
  };

  if (isInitiator) {
    peerConnection.createOffer().then(offer => {
      peerConnection.setLocalDescription(offer);
      socket.emit('signal', { to: userId, signal: { offer } });
    });
  }
}

function handleSignal(data) {
  const userId = data.from;
  const signal = data.signal;

  if (!peerConnections[userId]) {
    createPeerConnection(userId, false);
  }

  const pc = peerConnections[userId];

  if (signal.offer) {
    pc.setRemoteDescription(new RTCSessionDescription(signal.offer)).then(() => {
      pc.createAnswer().then(answer => {
        pc.setLocalDescription(answer);
        socket.emit('signal', { to: userId, signal: { answer } });
      });
    });
  }

  if (signal.answer) {
    pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
  }

  if (signal.candidate) {
    pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
  }
}
const screenShareBtn = document.createElement('button');
screenShareBtn.innerText = 'Share Screen';
document.body.appendChild(screenShareBtn);

screenShareBtn.onclick = async () => {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const screenTrack = screenStream.getVideoTracks()[0];

  // Replace video track for all peer connections
  for (const id in peerConnections) {
    const sender = peerConnections[id].getSenders().find(s => s.track.kind === 'video');
    if (sender) sender.replaceTrack(screenTrack);
  }

  // Show the screen stream locally
  localVideo.srcObject = screenStream;

  // When screen sharing stops, revert back to webcam
  screenTrack.onended = async () => {
    localStream.getVideoTracks()[0].enabled = true;
    for (const id in peerConnections) {
      const sender = peerConnections[id].getSenders().find(s => s.track.kind === 'video');
      if (sender) sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
    localVideo.srcObject = localStream;
  };
};
