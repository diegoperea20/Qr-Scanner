"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import QrCode from "qrcode-reader";

// ── Inline icons — stroke 1.6, sin emojis, profesional
const IconQr = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.2" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" />
    <rect x="14" y="14" width="4" height="4" rx="0.8" />
    <path d="M14 18 H21 M18 14 V21" />
    <rect x="5.5" y="5.5" width="2" height="2" rx="0.4" fill="currentColor" stroke="none" />
    <rect x="16.5" y="5.5" width="2" height="2" rx="0.4" fill="currentColor" stroke="none" />
    <rect x="5.5" y="16.5" width="2" height="2" rx="0.4" fill="currentColor" stroke="none" />
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 7a2 2 0 0 1 2-2h2l1.2-1.2A2 2 0 0 1 10.6 3H13.4a2 2 0 0 1 1.4.6L16 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);
const IconStop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
  </svg>
);
const IconSwitch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 7h10l-3-3M17 17H7l3 3" />
    <path d="M17 7v3M7 17v-3" opacity="0.0" />
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="8" y="4" width="8" height="4" rx="1" />
    <rect x="6" y="8" width="12" height="12" rx="1.5" />
    <path d="M9 12h6M9 16h6" />
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 16V6M12 6l-4 4M12 6l4 4" />
    <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 12.5l4 4 8-9" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 8v6M12 16h.01" />
    <path d="M10.2 3.2l-7 12A2 2 0 0 0 4.9 18h14.2a2 2 0 0 0 1.7-2.8l-7-12a2 2 0 0 0-3.4 0Z" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l7 3v5c0 4-3 6.8-7 8-4-1.2-7-4-7-8V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 19c-4 1.2-4-2-5-2M16 22v-3.2a3.3 3.3 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7a5.3 5.3 0 0 0-1.4-3.7 4.9 4.9 0 0 0-.1-3.7s-1.2-.3-3.9 1.4a13 13 0 0 0-7 0C6.2 2.4 5 2.7 5 2.7A4.9 4.9 0 0 0 4.9 6.4 5.3 5.3 0 0 0 3.5 10c0 5.2 3.1 6.4 6.1 6.7A3.3 3.3 0 0 0 8.7 19V22" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 5h6v6M10 14L20 4M11 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="10" height="10" rx="1.5" />
    <path d="M5 15V7a2 2 0 0 1 2-2h8" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v6h-6" />
  </svg>
);

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
  const [isPasting, setIsPasting] = useState(false);
  const [copied, setCopied] = useState(false);

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
            setSuccessMessage("QR code scanned successfully.");
            setError(null);
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

          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setQrData(code.data);
            setError(null);
            setSuccessMessage("QR code detected from image.");
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000);
            window.open(code.data, "_blank");
            return;
          }

          const qr = new QrCode();
          qr.callback = (err, result) => {
            if (err || !result) {
              setError("QR code could not be detected in the image.");
              setSuccessMessage(null);
              return;
            }
            setQrData(result.result);
            setError(null);
            setSuccessMessage("QR code detected from image.");
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

  const pasteFromClipboard = async () => {
    if (isPasting) return;
    setIsPasting(true);
    setError(null);

    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error("Clipboard API not supported");
      }

      const clipboardItems = await navigator.clipboard.read();
      let blob = null;

      for (const item of clipboardItems) {
        const imageType = item.types.find((type) =>
          type.startsWith("image/")
        );
        if (imageType) {
          blob = await item.getType(imageType);
          break;
        }
      }

      if (!blob) {
        setError("No image found in clipboard. Copy an image first.");
        return;
      }

      const file = new File([blob], "clipboard-image.png", {
        type: blob.type || "image/png",
      });
      setSuccessMessage("Image pasted — scanning…");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
      processFile(file);
    } catch (error) {
      console.log("Clipboard error:", error);
      setError(
        "Clipboard access denied or not supported. Allow clipboard permission and try again."
      );
    } finally {
      setIsPasting(false);
    }
  };

  const detectDevicesOnUserInteraction = async () => {
    if (!hasUserInteracted && devices.length === 0) {
      setHasUserInteracted(true);
      setIsDetectingDevices(true);

      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1, height: 1 },
        });
        tempStream.getTracks().forEach((track) => track.stop());
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        handleDevices(mediaDevices);
        if (
          mediaDevices.filter(({ kind }) => kind === "videoinput").length > 0
        ) {
          setSuccessMessage("Camera detected.");
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
        if (isCameraOn) {
          stopCamera();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        setCurrentDeviceIndex(nextIndex);
        setDeviceId(nextDeviceId);
        setError(null);
        if (isCameraOn) {
          try {
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
            setSuccessMessage(`Switched to camera ${nextIndex + 1}`);
          } catch (streamError) {
            console.log("Error starting new stream:", streamError);
            try {
              const fallbackStream = await navigator.mediaDevices.getUserMedia({
                video: true,
              });
              setStream(fallbackStream);
              setSuccessMessage(`Switched to camera ${nextIndex + 1}`);
            } catch (fallbackError) {
              console.log("Fallback also failed:", fallbackError);
              setError("Failed to switch camera. Please try again.");
              setIsCameraOn(false);
              setIsScanning(false);
              return;
            }
          }
        } else {
          setSuccessMessage(`Camera ${nextIndex + 1} selected`);
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
      stopCamera();
      setIsCameraOn(false);
      setIsScanning(false);
      setScanSuccess(false);
      setSuccessMessage("Camera stopped");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      try {
        setIsDetectingDevices(true);
        if (devices.length === 0) {
          await detectDevicesOnUserInteraction();
        }
        let newStream;
        try {
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
              newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: deviceId,
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              });
            }
          } else {
            newStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            });
          }
        } catch (streamError) {
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
        setSuccessMessage(`Camera ${currentDeviceIndex + 1} started — ready to scan`);
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

  const copyResult = async () => {
    if (!qrData) return;
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy to clipboard.");
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

  useEffect(() => {
    const handlePasteEvent = (event) => {
      const items = event.clipboardData && event.clipboardData.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            setError(null);
            setSuccessMessage("Image pasted — scanning…");
            setTimeout(() => {
              setSuccessMessage(null);
            }, 2000);
            processFile(file);
          }
          break;
        }
      }
    };
    document.addEventListener("paste", handlePasteEvent);
    return () => {
      document.removeEventListener("paste", handlePasteEvent);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="container" onClick={detectDevicesOnUserInteraction}>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden>
              <IconQr />
            </div>
            <div className="brand-text">
              <span className="brand-title">QR Scanner</span>
              <span className="brand-sub">On-device • Private</span>
            </div>
          </div>
          <div className="header-meta">
            <span className="meta-pill">
              <span className="meta-dot" aria-hidden />
              No upload • Runs in browser
            </span>
            <a
              href="https://github.com/diegoperea20/Qr-Scanner"
              target="_blank"
              rel="noopener noreferrer"
              className="header-link"
              aria-label="GitHub"
            >
              <IconGithub />
              <span className="header-link-text">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="hero">
          <h1>
            Scan QR codes <span>without compromise.</span>
          </h1>
          <p>
            Camera, image or clipboard  everything runs locally in your browser.
            No uploads, no tracking. <strong>Paste with Ctrl+V</strong> or start the camera.
          </p>
        </div>

        <div className="scanner-grid">
          {/* Left — Camera */}
          <section className="card">
            <div className="card-header">
              <div>
                <div className="card-eyebrow">
                  <i aria-hidden /> Camera
                </div>
                <div className="card-title">Live scan</div>
              </div>
              <span className={`card-status ${isCameraOn ? "live" : ""}`}>
                {isCameraOn ? (scanSuccess ? "Detected" : "Live") : "Idle"}
                {devices.length > 0 ? ` • CAM ${currentDeviceIndex + 1}/${devices.length}` : ""}
              </span>
            </div>

            <div className="camera-body">
              <div className="camera-view">
                {isCameraOn ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ deviceId }}
                      className="camera-video"
                      key={deviceId}
                    />
                    <div className={`finder ${isScanning && !scanSuccess ? "scanning" : ""}`} aria-hidden>
                      <span className="finder-corner tl" />
                      <span className="finder-corner tr" />
                      <span className="finder-corner bl" />
                      <span className="finder-corner br" />
                      {isScanning && !scanSuccess && <span className="finder-line" />}
                    </div>
                    <div className="scanning-overlay">
                      <span className={`scanning-chip ${scanSuccess ? "success" : ""}`}>
                        {scanSuccess ? <IconCheck /> : <IconCamera />}
                        {scanSuccess ? "QR detected — opening…" : "Scanning — hold steady"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="camera-placeholder">
                    <div className="camera-placeholder-icon" aria-hidden>
                      <IconCamera />
                    </div>
                    <div>
                      <strong>Camera is off</strong>
                      <p>Start the camera to scan in real time. You can switch lenses if multiple are detected.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="camera-actions">
                <button
                  className={`btn ${isCameraOn ? "btn-danger" : "btn-primary"}`}
                  onClick={toggleCamera}
                  disabled={isDetectingDevices}
                >
                  {isDetectingDevices ? (
                    <>Starting…</>
                  ) : isCameraOn ? (
                    <>
                      <IconStop /> Stop camera
                    </>
                  ) : (
                    <>
                      <IconCamera /> Start camera
                    </>
                  )}
                </button>

                {devices.length > 1 && (
                  <button
                    className="btn btn-ghost"
                    onClick={switchCamera}
                    disabled={isDetectingDevices}
                  >
                    <IconSwitch /> Switch ({currentDeviceIndex + 1}/{devices.length})
                  </button>
                )}

                <button
                  className="btn btn-ghost"
                  onClick={pasteFromClipboard}
                  disabled={isPasting}
                  title="Paste image from clipboard"
                >
                  <IconClipboard /> {isPasting ? "Pasting…" : "Paste"}
                </button>
              </div>

              <div className="clipboard-row">
                <span className="clipboard-hint">
                  <IconClipboard /> Tip: <kbd>Ctrl</kbd> + <kbd>V</kbd> pastes any QR image
                </span>
              </div>
            </div>
          </section>

          {/* Right — Upload / Result / Privacy */}
          <div className="stack">
            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-eyebrow">
                    <i aria-hidden /> Image
                  </div>
                  <div className="card-title">Upload or drop</div>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div
                  className={`drop ${isDragging ? "dragging" : ""}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <div className="drop-icon" aria-hidden>
                    <IconUpload />
                  </div>
                  <div className="drop-copy">
                    <p className="drop-title">Drop a QR image here</p>
                    <p className="drop-sub">PNG, JPG, WebP — or tap to browse</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <span className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    <IconUpload /> Select image
                  </span>
                </div>
              </div>
            </section>

            {successMessage && !scanSuccess && (
              <div className="banner banner-success" role="status">
                <IconCheck />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="banner banner-error" role="alert">
                <IconAlert />
                <span>{error}</span>
              </div>
            )}

            {qrData && (
              <section className="card">
                <div className="card-header">
                  <div>
                    <div className="card-eyebrow">
                      <i aria-hidden /> Result
                    </div>
                    <div className="card-title">QR detected</div>
                  </div>
                  <span className="card-status live">Ready</span>
                </div>
                <div className="result-body">
                  <p className="result-label">Decoded content</p>
                  <a
                    className="result-url"
                    href={qrData}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {qrData}
                  </a>
                  <div className="result-actions">
                    <button className="btn btn-primary btn-sm" onClick={copyResult}>
                      <IconCopy /> {copied ? "Copied" : "Copy"}
                    </button>
                    <a
                      className="btn btn-ghost btn-sm"
                      href={qrData}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconExternal /> Open link
                    </a>
                    <button className="btn btn-ghost btn-sm" onClick={resetScanner}>
                      <IconRefresh /> Scan another
                    </button>
                  </div>
                </div>
              </section>
            )}

            <div className="privacy-note">
              <IconShield />
              <span>
                <strong>Private by design.</strong> Decoding runs with jsQR + qrcode-reader
                directly in your browser. Images never leave your device.
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="project-github">
        <div className="footer-content">
          <div className="footer-left">
            <p>This project is on GitHub</p>
            <a
              href="https://github.com/diegoperea20/Qr-Scanner"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label="GitHub repository"
            >
              <IconGithub />
            </a>
          </div>
          <div className="footer-right">
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
