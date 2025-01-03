import React, { useEffect, useState, useRef } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { PhoneIcon } from "@heroicons/react/16/solid";
import { generateKitToken } from "./TokenGenerator";

export default function VideoCall({ onMeetEnd, doctorId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [patientId, setpatientId] = useState(null);
  const [doctor_Id, setdoctor_Id] = useState(null);
  const [patientName, setpatientName] = useState(null);
  const [doctorName, setdoctorName] = useState(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `https://api-wo6.onrender.com/patient-info/${doctorId}`
        );
        const data = await response.json();

        if (response.ok) {
          setPatients(data);
          setDocumentId(data._id);
          setpatientId(data.patient_id);
          setdoctor_Id(data.doctor_id);
          setdoctorName(data.doctor_assigned);
          setpatientName(data.user_id);
        } else {
          setError(data.detail || "Failed to fetch patient information");
        }
      } catch (error) {
        setError("Error fetching patient information");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [doctorId]);

  useEffect(() => {
    if (documentId && patientId && patientName && doctor_Id && doctorName) {
      init();
    }
  }, [documentId, patientId, patientName, doctor_Id, doctorName]);

  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
  });
  const zeroCloudInstance = useRef(null);

  async function init() {
    const userId = doctor_Id;
    const userName = doctorName;
    setUserInfo({
      userName,
      userId,
    });
    const appID = 1296580694;
    const serverSecret = "47e42973e5492120a04fc8c8b839232a";

    const KitToken = generateKitToken(documentId, userId, userName);

    zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);

    zeroCloudInstance.current.addPlugins({ ZIM });

    // Set up the callback for when a call ends
    zeroCloudInstance.current.onCallEnded = (endReason) => {
      console.log("Call ended. Reason:", endReason);

      // Handle different end reasons and call the onMeetEnd function
      if (
        endReason === "Declined" ||
        endReason === "Timeout" ||
        endReason === "Canceled" ||
        endReason === "Busy" ||
        endReason === "LeaveRoom"
      ) {
        onMeetEnd(); // Trigger logout or necessary cleanup
      }
    };
  }

  function handleSend(callType) {
    const callee = patientId;
    const calleeUsername = patientName;
  
    zeroCloudInstance.current
      .sendCallInvitation({
        callees: [{ userID: callee, userName: calleeUsername }],
        callType: callType,
        timeout: 60,
      })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          console.log("Error invitees:", res.errorInvitees);
          alert("The user does not exist or is offline.");
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }

  return (
    <div>
      <PhoneIcon
        className="w-4 h-4 cursor-pointer"
        onClick={() => {
          handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
        }}
      />
    </div>
  );
}
