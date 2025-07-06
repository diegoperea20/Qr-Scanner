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
  const [isDetectingDevices, setIsDetectingDevices] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [stream, setStream] = useState(null);

  const handleDevices = (mediaDevices) =>
    setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (webcamRef.current) {
      webcamRef.current = null;
    }
  };

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

          // --- PRIMERO INTENTAR CON jsQR ---
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setQrData(code.data);
            setError(null);
            setSuccessMessage("🎉 QR Code successfully scanned from image!");
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
            window.open(code.data, "_blank");
            return;
          }

          // --- SI FALLA, INTENTAR CON qrcode-reader ---
          const qr = new QrCode();
          qr.callback = (err, result) => {
            if (err || !result) {
              setError("QR code could not be detected in the image.");
              setSuccessMessage(null);
              return;
            }
            setQrData(result.result);
            setError(null);
            setSuccessMessage("🎉 QR Code successfully scanned from image!");
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

  const detectDevicesOnUserInteraction = async () => {
    if (!hasUserInteracted && devices.length === 0) {
      setHasUserInteracted(true);
      setIsDetectingDevices(true);

      try {
        // Intentar obtener permisos de cámara para detectar dispositivos
        const tempStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1, height: 1 },
        });

        // Detener el stream temporal inmediatamente
        tempStream.getTracks().forEach((track) => track.stop());

        // Ahora enumerar dispositivos
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        handleDevices(mediaDevices);

        if (
          mediaDevices.filter(({ kind }) => kind === "videoinput").length > 0
        ) {
          setSuccessMessage("📷 Cameras detected successfully!");
          setTimeout(() => {
            setSuccessMessage(null);
          }, 2000);
        }
      } catch (error) {
        console.log("Could not detect devices:", error);
        setError("Could not detect cameras. Please allow camera access.");
      } finally {
        setIsDetectingDevices(false);
      }
    }
  };

  const switchCamera = async () => {
    if (devices.length > 1) {
      try {
        const nextIndex = (currentDeviceIndex + 1) % devices.length;
        const nextDeviceId = devices[nextIndex].deviceId;

        // Detener cámara actual si está encendida
        if (isCameraOn) {
          stopCamera();
          // Pequeña pausa para asegurar que el stream anterior se detenga completamente
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setCurrentDeviceIndex(nextIndex);
        setDeviceId(nextDeviceId);
        setError(null);

        if (isCameraOn) {
          // Reiniciar cámara con nuevo dispositivo
          try {
            // Intentar con constraints específicos primero
            let newStream;
            try {
              newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: { exact: nextDeviceId },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
            } catch (specificError) {
              // Si falla, intentar con constraints más flexibles
              console.log(
                "Specific deviceId failed, trying flexible constraints"
              );
              newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: nextDeviceId,
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
            }

            setStream(newStream);
            setSuccessMessage(`🔄 Switched to camera ${nextIndex + 1}`);
          } catch (streamError) {
            console.log("Error starting new stream:", streamError);

            // Intentar con constraints básicos como último recurso
            try {
              const fallbackStream = await navigator.mediaDevices.getUserMedia({
                video: true,
              });
              setStream(fallbackStream);
              setSuccessMessage(
                `🔄 Switched to camera ${nextIndex + 1} (fallback mode)`
              );
            } catch (fallbackError) {
              console.log("Fallback also failed:", fallbackError);
              setError("Failed to switch camera. Please try again.");
              setIsCameraOn(false);
              setIsScanning(false);
              return;
            }
          }
        } else {
          setSuccessMessage(
            `📷 Camera ${nextIndex + 1} selected (camera is off)`
          );
        }

        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } catch (error) {
        console.log("Error switching camera:", error);
        setError("Failed to switch camera. Please try again.");
      }
    } else {
      setError("No other camera is detected.");
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Apagar cámara inmediatamente
      stopCamera();
      setIsCameraOn(false);
      setIsScanning(false);
      setScanSuccess(false);
      setSuccessMessage("📷 Camera stopped");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      try {
        setIsDetectingDevices(true);

        // Intentar detectar dispositivos si no se han detectado
        if (devices.length === 0) {
          await detectDevicesOnUserInteraction();
        }

        // Intentar obtener permisos de cámara con diferentes estrategias
        let newStream;
        try {
          // Intentar con deviceId específico si está disponible
          if (deviceId) {
            try {
              newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: { exact: deviceId },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
            } catch (specificError) {
              // Si falla con exact, intentar sin exact
              newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: deviceId,
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
            }
          } else {
            // Si no hay deviceId, usar constraints básicos
            newStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            });
          }
        } catch (streamError) {
          // Fallback a constraints básicos
          console.log(
            "Specific constraints failed, trying basic video:",
            streamError
          );
          newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }

        setStream(newStream);
        setIsCameraOn(true);
        setIsScanning(true);
        setScanSuccess(false);
        setSuccessMessage(
          `📷 Camera ${currentDeviceIndex + 1} started - Ready to scan!`
        );
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } catch (error) {
        console.log("Camera permission error:", error);
        setError(
          "Camera permission denied. Please allow camera access and try again."
        );
      } finally {
        setIsDetectingDevices(false);
      }
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
    if (isCameraOn) {
      setIsScanning(true);
    }
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
    if (devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  // Limpiar stream al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="container" onClick={detectDevicesOnUserInteraction}>
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
                disabled={isDetectingDevices}
              >
                {isDetectingDevices
                  ? "🔍 Starting Camera..."
                  : isCameraOn
                  ? "🛑 Stop Camera"
                  : "📷 Start Camera"}
              </button>

              {devices.length > 1 && (
                <button
                  className={`switch-camera-btn ${
                    !isCameraOn ? "camera-off" : ""
                  }`}
                  onClick={switchCamera}
                  disabled={isDetectingDevices}
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
                  key={deviceId} // Forzar re-render cuando cambia deviceId
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
