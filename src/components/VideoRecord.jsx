/* eslint-disable react/display-name */
import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import Webcam from "react-webcam";

const VideoRecord = forwardRef((_, ref) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setWebcamStream(stream);
        console.log("Webcam stream is ready.");
      })
      .catch((error) => console.error("Error accessing webcam:", error));
  }, []);

  // useImperativeHandle(ref, () => ({
  //   startRecording: () => {
  //     if (webcamStream) {
  //       handleStartCaptureClick();
  //     } else {
  //       console.warn("Trying to start recording before webcam is ready.");
  //     }
  //   },
  //   stopRecording: async () => {
  //     await handleStopCaptureClick();
  //   },
  // }));

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      if (webcamStream) {
        handleStartCaptureClick();
      } else {
        console.warn("Trying to start recording before webcam is ready.");
      }
    },
    stopRecording: async () => {
      await handleStopCaptureClick();
      
      // Stop the camera stream when recording stops
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    },
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

  const handleStopCaptureClick = async () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        console.log("Stopping video recording...");
        
        // Store recorded chunks in a local variable instead of state
        let chunks = [];
  
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
  
        mediaRecorderRef.current.onstop = () => {
          console.log("MediaRecorder stopped.");
          
          setTimeout(() => {
            if (chunks.length > 0) {
              console.log("Downloading video...");
              const blob = new Blob(chunks, { type: "video/webm" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "exam-recording.webm";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } else {
              console.warn("No recorded chunks found.");
            }
            resolve();
          }, 500); // Delay ensures data is captured before using it
        };
  
        mediaRecorderRef.current.stop();
        setCapturing(false);
      } else {
        resolve();
      }
    });
  };
  
  
  

  return (
    <div>
      <Webcam
        audio
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
