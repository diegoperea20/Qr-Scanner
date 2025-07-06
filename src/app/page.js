"use client";
//import QrScanner from "@/components/QrScanner";
import Link from "next/link";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import QrCode from "qrcode-reader";

const Home = () => {
  const webcamRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleDevices = (mediaDevices) =>
    setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));

  const capture = () => {
    if (webcamRef.current && isScanning) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
            setIsScanning(false);
            setScanSuccess(true);
            setSuccessMessage("🎉 QR Code successfully scanned!");
            setError(null);
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage(null);
              setScanSuccess(false);
            }, 3000);
            window.open(code.data, "_blank");
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
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          const qr = new QrCode();
          qr.callback = (err, result) => {
            if (err) {
              console.error(err);
              setError("QR code could not be detected in the image.");
              setSuccessMessage(null);
              return;
            }
            setQrData(result.result);
            setError(null);
            setSuccessMessage("🎉 QR Code successfully scanned from image!");
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
            window.open(result.result, "_blank");
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
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      setCurrentDeviceIndex(nextIndex);
      setDeviceId(devices[nextIndex].deviceId);
      setError(null);

      if (isCameraOn) {
        setSuccessMessage(`🔄 Switched to camera ${nextIndex + 1}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } else {
        setSuccessMessage(
          `📷 Camera ${nextIndex + 1} selected (camera is off)`
        );
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      }
    } else {
      setError("No other camera is detected.");
    }
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      setIsCameraOn(false);
      setIsScanning(false);
      setScanSuccess(false);
      setSuccessMessage("📷 Camera stopped");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      setIsCameraOn(true);
      setIsScanning(true);
      setScanSuccess(false);
      setSuccessMessage(
        `📷 Camera ${currentDeviceIndex + 1} started - Ready to scan!`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
    setError(null);
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

  const resetScanner = () => {
    setQrData(null);
    setError(null);
    setSuccessMessage(null);
    setScanSuccess(false);
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        capture();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  return (
    <div className="container">
      <div className="main-content">
        <header className="app-header">
          <h1 className="app-title">
            <span className="qr-icon">📱</span>
            QR Code Scanner
          </h1>
          <p className="app-subtitle">
            Scan QR codes with your camera or upload images
          </p>
        </header>

        <div className="scanner-container">
          <div className="camera-section">
            <div className="camera-controls">
              <button
                className={`camera-btn ${isCameraOn ? "active" : ""}`}
                onClick={toggleCamera}
              >
                {isCameraOn ? "🛑 Stop Camera" : "📷 Start Camera"}
              </button>

              {devices.length > 1 && (
                <button
                  className={`switch-camera-btn ${!isCameraOn ? 'camera-off' : ''}`}
                  onClick={switchCamera}
                >
                  🔄 Switch Camera ({currentDeviceIndex + 1}/{devices.length})
                </button>
              )}
            </div>

            {isCameraOn && (
              <div className="camera-view">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ deviceId }}
                  className="camera-video"
                />
                {(isScanning || scanSuccess) && (
                  <div className="scanning-overlay">
                    <div className="scanning-indicator">
                      {scanSuccess ? (
                        <>
                          <div className="success-line"></div>
                          <p className="success-text">
                            🎉 QR Code Successfully Scanned!
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="scanning-line"></div>
                          <p>Scanning for QR codes...</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="upload-section">
            <div
              className={`file-upload-container ${
                isDragging ? "dragging" : ""
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📁</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Select Image File
              </button>
              <p className="upload-text">or drag and drop an image here</p>
            </div>
          </div>

          {successMessage && !scanSuccess && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {qrData && (
            <div className="result-section">
              <h3 className="result-title">
                <span className="success-icon">✅</span>
                QR Code Detected!
              </h3>
              <div className="result-content">
                <a
                  className="qr-link"
                  href={qrData}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {qrData}
                </a>
                <button className="reset-btn" onClick={resetScanner}>
                  🔄 Scan Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="project-github">
        <div className="footer-content">
          <div className="footer-section">
            <p>This project is on GitHub</p>
            <a
              href="https://github.com/diegoperea20/Qr-Scanner"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/fluency/96/github.png"
                alt="GitHub"
                className="github-icon"
              />
            </a>
          </div>
          <div className="footer-section">
            <p className="created-by">
              Created by{" "}
              <a
                href="https://github.com/diegoperea20"
                target="_blank"
                rel="noopener noreferrer"
                className="author-link"
              >
                Diego Ivan Perea Montealegre
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
