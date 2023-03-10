import React, { useRef } from 'react';
import IVSBroadcastClient, { BASIC_LANDSCAPE } from 'amazon-ivs-web-broadcast';
import './AmazonIVS.css';
const Broadcast = () => {
  async function handlePermissions() {
    let permissions = {
      audio: false,
      video: false,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      for (const track of stream.getTracks()) {
        track.stop();
      }
      permissions = { video: true, audio: true };
    } catch (err) {
      permissions = { video: false, audio: false };
      console.error(err.message);
    }
    // If we still don't have permissions after requesting them display the error message
    if (!permissions.video) {
      console.error('Failed to get video permissions.');
    } else if (!permissions.audio) {
      console.error('Failed to get audio permissions.');
    }
  }

  const startBroadcast = async () => {
    const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;
    const devices = await navigator.mediaDevices.enumerateDevices();
    window.videoDevices = devices.filter((d) => d.kind === 'videoinput');
    window.audioDevices = devices.filter((d) => d.kind === 'audioinput');
    console.log(window.videoDevices);

    window.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId:
          '37dd0048bee7e6f83319dec1119d626f347c0ed3eac1242c7efc13e935eb8e1f',
        width: {
          ideal: streamConfig.maxResolution.width,
          max: streamConfig.maxResolution.width,
        },
        height: {
          ideal: streamConfig.maxResolution.height,
          max: streamConfig.maxResolution.height,
        },
      },
    });

    const client = IVSBroadcastClient.create({
      // Enter the desired stream configuration
      streamConfig,
      // Enter the ingest endpoint from the AWS console or CreateChannel API
      ingestEndpoint:
        'rtmps://d431ae37b260.global-contribute.live-video.net:443/app/',
    });
    client.addVideoInputDevice(window.cameraStream, 'camera1', { index: 0 }); // only 'index' is required for the position parameter
    client.addAudioInputDevice(window.microphoneStream, 'mic1');
    const previewEl = document.getElementById('preview');
    client.attachPreview(previewEl);
  };

  return (
    <div>
      <button onClick={startBroadcast}>Start broadcast</button>
      <canvas id="preview" />
    </div>
  );
};

export default Broadcast;
