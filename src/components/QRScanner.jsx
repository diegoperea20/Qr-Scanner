"use client";

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import QrCode from 'qrcode-reader';

const QrScanner = () => {
  const webcamRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDevices = mediaDevices =>
    setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
            window.open(code.data, '_blank');
          }
        };
      }
    }
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          const qr = new QrCode();
          qr.callback = (err, result) => {
            if (err) {
              console.error(err);
              setError('QR code could not be detected in the image.');
              return;
            }
            setQrData(result.result);
            setError(null);
            window.open(result.result, '_blank');
          };
          qr.decode(imageData);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const switchCamera = () => {
    if (devices.length > 1) {
      setCurrentDeviceIndex((prevIndex) => (prevIndex + 1) % devices.length);
      setDeviceId(devices[(currentDeviceIndex + 1) % devices.length].deviceId);
    } else {
      setError('No other camera is detected.');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  useEffect(() => {
    if (isCameraOn) {
      const interval = setInterval(() => {
        capture();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCameraOn]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  return (
    <div className='div-center'>
      <button onClick={() => setIsCameraOn(prev => !prev)}>
        {isCameraOn ? 'Turn off camera' : 'Turn on Camera'}
      </button>
      {isCameraOn && (
        <>
          <button onClick={switchCamera}>Change Camera</button>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId }}
            width="500px"
            height="auto"
          />
        </>
      )}
      <div 
        className={`file-upload-container ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current.click()}>
          Select File
        </button>
        <p>or Drag files here</p>
      </div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {qrData && (
        <div>
          <h3>QR code detected:</h3>
          <a className="link-qr" href={qrData} target="_blank" rel="noopener noreferrer">
            {qrData}
          </a>
        </div>
      )}
    </div>
  );
};

export default QrScanner;