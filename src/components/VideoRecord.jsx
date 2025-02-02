/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import Webcam from "react-webcam";

const VideoRecord = forwardRef((_, ref) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setWebcamStream(stream);
        console.log("Webcam stream is ready.");
      })
      .catch(error => console.error("Error accessing webcam:", error));
  }, []);

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      if (webcamStream) {
        handleStartCaptureClick();
      } else {
        console.warn("Trying to start recording before webcam is ready.");
      }
    },
    stopRecording: handleStopCaptureClick,
  }));

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    if (!webcamStream) {
      console.error("Webcam stream not available yet.");
      return;
    }
    console.log("Starting video recording...");
    setCapturing(true);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamStream, { mimeType: "video/webm" });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
  }, [webcamStream, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      console.log("Stopping video recording...");
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }
  }, []);

  useEffect(() => {
    if (recordedChunks.length > 0) {
      console.log("Downloading video...");
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "exam-recording.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <div>
      <Webcam
        audio={true}
        videoConstraints={{ facingMode: "user" }}
        onUserMedia={(stream) => {
          setWebcamStream(stream);
          console.log("Webcam initialized inside Webcam component.");
        }}
        style={{ display: "none" }}
      />
    </div>
  );
});

export default VideoRecord;
