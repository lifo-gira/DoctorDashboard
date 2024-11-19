import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Dashboard";
import Schedule from "./Schedule";
import RegimeBuilder from "./RegimeBuilder";
import Sample from "./Sample";
import Chatting from "./Chatting";
import Events from "./Events";
import Reports from "./Reports";
import Detailreport from "./Detailreport";
import Doc from "./Assets/docbg.png";
import Spinner from "./Assets/Spinner";
import Cookies from "js-cookie";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";
import VideoCall from "./VideoCall";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Chat } from "@zegocloud/zimkit-react";

function App() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
const [selectedPatient, setSelectedPatient] = useState(null);
const [reportData, setReportData] = useState(null);
const [regimeBuilderData, setRegimeBuilderData] = useState(null); // State to hold data for RegimeBuilder
const [detailReportData, setDetailReportData] = useState(null);
const [userName, setUserName] = useState("");
const [password, setPassword] = useState("");
const [isChecked, setIsChecked] = useState(false);
const [isloged, setisloged] = useState(false);
const [status, setStatus] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard setCurrentPage={setActiveComponent} toReportPage={toReportPage}/>;
      case "schedule":
        return <Schedule setCurrentPage={setActiveComponent} toReportPage={toReportPage}/>;
      case "regimeBuilder":
        return <RegimeBuilder setCurrentPage={handleComponentChange} regimeData={regimeBuilderData} toReportPage={toReportPage}/>; 
      case "sample":
        return <Sample />;
      case "chat":
        return <Chatting uname={userName}/>;
      case "events":
        return <Events />;
        case "reports":
          return (
            <Reports
            setCurrentPage={(component, props) => {
              if (component === "regimeBuilder") {
                console.log('Received data for toRegime:', props.toRegime);
              }
              handleComponentChange(component, props); // Use the new function
            }}
            reportData={reportData}
            toReportPage={toReportPage}
          />
          );
      case "detailreports":
        return <Detailreport assessment={detailReportData.assessment} index={detailReportData.index} reportData={detailReportData.reportData} selected={detailReportData.selected}/>
      default:
        return <RegimeBuilder />;
    }
  };



  const handleComponentChange = (component, props) => {
    console.log('Navigating to component:', component);
    if (props) {
      console.log('Received props:', props); // Log the props being passed
      if (component === "regimeBuilder") {
        setRegimeBuilderData(props.toRegime); // Store the props for RegimeBuilder
      } else if (component === "detailreports") {
        setDetailReportData({
          assessment: props.assessment, // Store the assessment data
          index: props.index, // Store the index
          reportData: props.reportData, // Store the report data
          selected: props.selected
        });
      }
    }
    setActiveComponent(component); // Update the active component state
  };
  
  

  const toReportPage = (data) => {
    console.log("Data received:", data);
    setReportData(data); // Store the received data in state
  };

 

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');

    if (loggedIn) {
      setisloged(true); // Set the logged-in state to true
      console.log(isloged,"HIIII")
    }
}, []);


  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogout = () => {
    setisloged(false);
    localStorage.removeItem('isLoggedIn');
    window.location.reload(); // Refresh the page to reflect the change
};

const handleLoginchange = async () => {
  setStatus(<Spinner />);
  const data = new URLSearchParams();
  data.append("user_id", userName);
  data.append("password", password);

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  await fetch("https://api-wo6.onrender.com/login?" + data, options)
    .then((res) => res.json())
    .then(async (data) => { // Change this to async to await fetch
      console.log(data);

      if (data == null) {
        setStatus(<h3 className="text-[#bf2f2f]">Invalid Credentials</h3>);
      } else if (data.type !== "doctor") {
        // Show a message if the logged-in user is not a doctor
        setStatus(
          <h3 className="text-[#bf2f2f]">
            Please login using doctor credentials
          </h3>
        );
      } else {
        // If the type is doctor, proceed with the login
        Cookies.set("isLoggedIn", true);
        Cookies.set("user", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("user", JSON.stringify(data));
        
        var storedData = localStorage.getItem("user");
        var parsedData = JSON.parse(storedData);
        localStorage.setItem("_id", parsedData._id);
        console.log(localStorage.getItem("_id", parsedData._id));

        setisloged(!isloged);
        setStatus(null); // Clear status on success

        // Directly fetch patients after successful login
        try {
          const response = await fetch(
            "https://api-wo6.onrender.com/patient-details/all"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const allPatients = await response.json();

          // Filter patients based on doctor_id
          const filteredPatients = allPatients.filter(
            (patient) => patient.doctor_id === parsedData._id
          );

          // Assuming you want the first patient's id if it exists
          if (filteredPatients.length > 0) {
            const firstPatientId = filteredPatients[0].patient_id; // Adjust based on your data structure
            console.log("First patient ID:", firstPatientId);
            // Proceed with any further actions using firstPatientId
            handleCallClick(firstPatientId); // Call your function with the patient_id
          } else {
            console.log("No patients found for this doctor.");
          }
        } catch (error) {
          console.error("Error fetching patient information:", error);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      setStatus(<h3 className="text-[#bf2f2f]">Login Failed</h3>);
    });
};



  const [emailNotFound, setEmailNotFound] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log("Received Google OAuth Response:", response);
        
        // Check if credential is present
        if (!response.credential) {
          throw new Error("No credential received from Google");
        }
  
        const decode = jwt_decode(response.credential); // decode the token
        console.log(decode);
  
        const email = decode.email; // Get the email from the decoded token
  
        // First, check if the email exists
        const userCheckResponse = await axios.get(`https://api-wo6.onrender.com/users/${email}`);
  
        if (userCheckResponse.status === 200) {
          const userData = userCheckResponse.data; // This will be the data of the user
  
          // Prepare the callback data based on the existing user data
          const callbackData = {
            type: userData.type, // Use the existing type (doctor or patient)
            name: userData.name,
            user_id: userData.user_id,
            email: userData.email,
            password: `${decode.given_name}@123`, // sample password, if needed
            data: userData.data || [], // Any additional data you want to send
            videos: userData.videos || [],
            doctor: userData.doctor || "doctor001", // Use existing doctor if applicable
          };
  
          console.log(callbackData, "call");
  
          // try {
          //   // Send data to your backend API for login
          //   await axios.post(
          //     "https://api-wo6.onrender.com/google-login",
          //     callbackData,
          //     {
          //       headers: {
          //         "Content-Type": "application/json",
          //       },
          //     }
          //   );
  
          //   // Storing the user data locally
          //   localStorage.setItem("isLoggedIn", true);
          //   localStorage.setItem("user", JSON.stringify(callbackData));
          //   // Optionally navigate to another page here
          // }
          // catch (error) {
          //   if (error.response && error.response.status === 401) {
          //     console.log("User not found. Please register first.");
          //     setEmailNotFound(true); // show the error
          //   } else {
          //     console.error("Error processing Google OAuth response:", error);
          //   }
          // }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    onError: () => console.log("Google login failed"),
  });

  const handleCallClick = async (userId) => {
    try {
      // Fetch patient information
      const response = await fetch(`https://api-wo6.onrender.com/patient-info/${userId}`);
      console.log("IN")
      if (!response.ok) {
        throw new Error("Failed to fetch patient information");
      }
      const data = await response.json();
      const documentId = data._id;
      const patientId = data.patient_id;
      const doctorId = data.doctor_id;
      const patientName = data.user_id;
      const doctorName = data.doctor_assigned;
  
      // Generate KitToken
      const appID = 1455965454;
      const serverSecret = "c49644efc7346cc2a7a899aed401ad76";
      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        documentId,
        doctorId,
        doctorName
      );
  
      // Initialize Zego Cloud SDK
      const zeroCloudInstance = ZegoUIKitPrebuilt.create(KitToken);
      zeroCloudInstance.addPlugins({ ZIM });
  
      // Send video call invitation
      const callee = patientId;
      const calleeUsername = patientName;
      zeroCloudInstance
        .sendCallInvitation({
          callees: [{ userID: callee, userName: calleeUsername }],
          callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
          timeout: 60,
        })
        .then((res) => {
          console.warn(res);
          if (res.errorInvitees.length) {
            alert("The user does not exist or is offline.");
            return null;
          }
        })
        .catch((err) => {
          console.error(err);
          // alert("The user does not exist or is offline.");
          return null;
        });
    } catch (error) {
      console.error(error);
      return;
      // Handle errors
    }
  };
  
  return (
    <>
      {isloged ? (
        <div className="flex h-screen bg-[#7075DB]">
          <div className="w-[7%] h-full flex justify-center items-center">
            <div className="w-full h-[65%] flex flex-col items-center gap-10">
              <button onClick={() => setActiveComponent("dashboard")}>
                <svg
                  width="31"
                  height="32"
                  viewBox="0 0 31 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1708)">
                    <path
                      d="M3.99805 17.0341H14.2394V4.23242H3.99805L3.99805 17.0341ZM3.99805 27.2754H14.2394V19.5944H3.99805V27.2754ZM16.7997 27.2754H27.0411V14.4738H16.7997V27.2754ZM16.7997 4.23242V11.9134H27.0411V4.23242L16.7997 4.23242Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1708">
                      <rect
                        width="30.724"
                        height="30.724"
                        fill="white"
                        transform="translate(0.158203 0.392578)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button onClick={() => setActiveComponent("events")}>
                <svg
                  width="31"
                  height="32"
                  viewBox="0 0 31 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1712)">
                    <path
                      d="M21.9213 4.40408L27.0419 4.40408C27.3814 4.40408 27.7071 4.53896 27.9471 4.77904C28.1872 5.01911 28.3221 5.34473 28.3221 5.68425V26.1669C28.3221 26.5064 28.1872 26.8321 27.9471 27.0721C27.7071 27.3122 27.3814 27.4471 27.0419 27.4471H3.99892C3.6594 27.4471 3.33378 27.3122 3.0937 27.0721C2.85362 26.8321 2.71875 26.5064 2.71875 26.1669L2.71875 5.68425C2.71875 5.34473 2.85362 5.01911 3.0937 4.77904C3.33378 4.53896 3.6594 4.40408 3.99892 4.40408H9.11959V1.84375H11.6799V4.40408H19.3609V1.84375H21.9213V4.40408ZM5.27908 12.0851L5.27908 24.8868H25.7618V12.0851H5.27908ZM7.83942 17.2058H14.2403V22.3264H7.83942V17.2058Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1712">
                      <rect
                        width="30.724"
                        height="30.724"
                        fill="white"
                        transform="translate(0.158203 0.564453)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button onClick={() => setActiveComponent("schedule")}>
                <svg
                  width="31"
                  height="32"
                  viewBox="0 0 31 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1716)">
                    <path
                      d="M15.5204 29.0721C8.45006 29.0721 2.71875 23.3408 2.71875 16.2704C2.71875 10.5378 6.48628 5.686 11.6799 4.05507V6.77414C9.47922 7.66776 7.65738 9.29826 6.52604 11.3867C5.39471 13.4752 5.02418 15.8919 5.47784 18.2234C5.93149 20.5549 7.18114 22.6563 9.01303 24.1682C10.8449 25.6801 13.1452 26.5085 15.5204 26.5118C17.5607 26.5117 19.5546 25.9025 21.2464 24.7621C22.9383 23.6217 24.2511 22.0021 25.0167 20.1109H27.7358C26.1048 25.3046 21.253 29.0721 15.5204 29.0721ZM28.2581 17.5506H14.2403V3.53276C14.6614 3.49051 15.089 3.46875 15.5204 3.46875C22.5908 3.46875 28.3221 9.20006 28.3221 16.2704C28.3221 16.7018 28.3003 17.1294 28.2581 17.5506ZM16.8006 6.10845V14.9903H25.6824C25.3974 12.7341 24.37 10.6368 22.762 9.02882C21.154 7.4208 19.0567 6.3934 16.8006 6.10845Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1716">
                      <rect
                        width="30.724"
                        height="30.724"
                        fill="white"
                        transform="translate(0.158203 0.908203)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>

              <button onClick={() => setActiveComponent("chat")}>
                <svg
                  width="31"
                  height="32"
                  viewBox="0 0 31 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1720)">
                    <path
                      d="M2.71875 12.2495C2.71808 11.241 2.91635 10.2423 3.30221 9.31048C3.68807 8.3787 4.25395 7.53219 4.96743 6.81942C5.68091 6.10666 6.52799 5.54163 7.46015 5.1567C8.39231 4.77177 9.39125 4.5745 10.3998 4.57618L20.6411 4.57618C24.8823 4.57618 28.3221 8.02623 28.3221 12.2495V27.6192H10.3998C6.15856 27.6192 2.71875 24.1691 2.71875 19.9459V12.2495ZM25.7618 25.0589V12.2495C25.7584 10.8932 25.2176 9.59346 24.2578 8.6351C23.298 7.67674 21.9974 7.13787 20.6411 7.13652H10.3998C9.72747 7.13483 9.06147 7.26588 8.43994 7.52214C7.81842 7.7784 7.25359 8.15483 6.77786 8.62985C6.30212 9.10487 5.92484 9.66913 5.66765 10.2903C5.41046 10.9114 5.27841 11.5772 5.27909 12.2495V19.9459C5.28247 21.3022 5.8233 22.6019 6.7831 23.5603C7.7429 24.5186 9.04342 25.0575 10.3998 25.0589H25.7618ZM18.0808 14.8175H20.6411V17.3779H18.0808V14.8175ZM10.3998 14.8175H12.9601V17.3779H10.3998V14.8175Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1720">
                      <rect
                        width="30.724"
                        height="30.724"
                        fill="white"
                        transform="translate(0.158203 0.736328)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              
              <button >
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1724)">
                    <path
                      d="M4.72024 23.2937C4.14299 22.2955 3.69428 21.2283 3.38477 20.1175C4.05838 19.7749 4.6241 19.2526 5.01932 18.6085C5.41455 17.9643 5.62388 17.2234 5.62417 16.4677C5.62445 15.7119 5.41567 14.9708 5.02092 14.3264C4.62618 13.6819 4.06086 13.1592 3.3875 12.8161C4.00476 10.5842 5.18004 8.5461 6.80264 6.8939C7.43637 7.30591 8.17173 7.53454 8.92735 7.55451C9.68297 7.57447 10.4294 7.38498 11.084 7.00701C11.7386 6.62903 12.2758 6.07732 12.6363 5.41292C12.9967 4.74852 13.1663 3.99734 13.1263 3.24252C15.3686 2.66303 17.7216 2.66397 19.9634 3.24525C19.9238 4.00006 20.0937 4.75112 20.4545 5.41533C20.8152 6.07954 21.3527 6.631 22.0074 7.00868C22.6621 7.38637 23.4086 7.57554 24.1641 7.55529C24.9197 7.53503 25.6549 7.30612 26.2885 6.8939C27.0791 7.69955 27.781 8.61581 28.3709 9.63858C28.9622 10.6613 29.4046 11.7278 29.7064 12.8148C29.0328 13.1574 28.467 13.6796 28.0718 14.3238C27.6766 14.9679 27.4673 15.7089 27.467 16.4646C27.4667 17.2204 27.6755 17.9614 28.0702 18.6059C28.465 19.2503 29.0303 19.773 29.7036 20.1161C29.0864 22.3481 27.9111 24.3862 26.2885 26.0384C25.6548 25.6264 24.9194 25.3977 24.1638 25.3778C23.4082 25.3578 22.6618 25.5473 22.0072 25.9253C21.3526 26.3032 20.8153 26.8549 20.4549 27.5194C20.0944 28.1838 19.9248 28.9349 19.9648 29.6898C17.7225 30.2692 15.3695 30.2683 13.1277 29.687C13.1674 28.9322 12.9974 28.1811 12.6367 27.5169C12.2759 26.8527 11.7385 26.3013 11.0838 25.9236C10.429 25.5459 9.68258 25.3567 8.927 25.377C8.17143 25.3972 7.43619 25.6262 6.80264 26.0384C5.99561 25.2149 5.29593 24.2927 4.72024 23.2937ZM12.449 23.5613C13.9042 24.4006 14.9982 25.7475 15.5214 27.3438C16.2028 27.408 16.8869 27.4093 17.5683 27.3452C18.0919 25.7487 19.1865 24.4017 20.6421 23.5627C22.0967 22.7211 23.8108 22.4464 25.4555 22.7912C25.8515 22.2341 26.1929 21.6401 26.4769 21.0188C25.3564 19.7672 24.7374 18.146 24.7386 16.4661C24.7386 14.7456 25.3804 13.1384 26.4769 11.9135C26.1909 11.2924 25.8481 10.6991 25.4528 10.1411C23.8091 10.4856 22.0961 10.2114 20.6421 9.37094C19.187 8.53165 18.0929 7.18473 17.5697 5.58847C16.8883 5.52429 16.2042 5.52292 15.5228 5.5871C14.9993 7.18359 13.9047 8.53055 12.449 9.36957C10.9945 10.2112 9.28033 10.4859 7.6356 10.1411C7.24038 10.6986 6.89841 11.292 6.6142 11.9135C7.7347 13.1651 8.3537 14.7863 8.3525 16.4661C8.3525 18.1867 7.71071 19.7939 6.6142 21.0188C6.90024 21.6399 7.24307 22.2332 7.63833 22.7912C9.28202 22.4467 10.995 22.7209 12.449 23.5613ZM16.5456 20.5627C15.4591 20.5627 14.4171 20.1311 13.6489 19.3628C12.8806 18.5946 12.449 17.5526 12.449 16.4661C12.449 15.3797 12.8806 14.3377 13.6489 13.5694C14.4171 12.8012 15.4591 12.3696 16.5456 12.3696C17.632 12.3696 18.674 12.8012 19.4423 13.5694C20.2105 14.3377 20.6421 15.3797 20.6421 16.4661C20.6421 17.5526 20.2105 18.5946 19.4423 19.3628C18.674 20.1311 17.632 20.5627 16.5456 20.5627ZM16.5456 17.8316C16.9077 17.8316 17.255 17.6878 17.5111 17.4317C17.7672 17.1756 17.9111 16.8283 17.9111 16.4661C17.9111 16.104 17.7672 15.7567 17.5111 15.5006C17.255 15.2445 16.9077 15.1006 16.5456 15.1006C16.1834 15.1006 15.8361 15.2445 15.58 15.5006C15.3239 15.7567 15.1801 16.104 15.1801 16.4661C15.1801 16.8283 15.3239 17.1756 15.58 17.4317C15.8361 17.6878 16.1834 17.8316 16.5456 17.8316Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1724">
                      <rect
                        width="32.7723"
                        height="32.7723"
                        fill="white"
                        transform="translate(0.158203 0.0800781)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button onClick={handleLogout}>
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_643_1728)">
                    <path
                      d="M5.27995 23.2952H7.84029V25.8555H23.2023V5.37283L7.84029 5.37283V7.93317H5.27995V4.09267C5.27995 3.75315 5.41483 3.42753 5.65491 3.18745C5.89499 2.94737 6.2206 2.8125 6.56012 2.8125L24.4825 2.8125C24.822 2.8125 25.1476 2.94737 25.3877 3.18745C25.6278 3.42753 25.7626 3.75315 25.7626 4.09267V27.1357C25.7626 27.4752 25.6278 27.8008 25.3877 28.0409C25.1476 28.281 24.822 28.4158 24.4825 28.4158H6.56012C6.2206 28.4158 5.89499 28.281 5.65491 28.0409C5.41483 27.8008 5.27995 27.4752 5.27995 27.1357V23.2952ZM7.84029 14.334H16.8015V16.8943H7.84029V20.7348L1.43945 15.6142L7.84029 10.4935V14.334Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_643_1728">
                      <rect
                        width="30.724"
                        height="30.724"
                        fill="white"
                        transform="translate(0.158203 0.251953)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <div className="w-[93%] h-[98%] my-auto mr-1.5 bg-[#F8F8F8] rounded-l-[50px] overflow-hidden">
            {renderComponent()}
            {isVideoCallVisible && <VideoCall onCallClick={handleCallClick} />}
          </div>
        </div>
      ) : (
        <div className="w-full h-screen bg-white flex flex-row">
          <div className="w-[55%] my-auto flex flex-col gap-16 items-center justify-center">
            <div className="w-[70%] flex flex-col gap-2">
              <p className="font-poppins font-semibold text-5xl text-black">
                DOCTOR
              </p>
              <p className="font-poppins font-semibold text-4xl text-[#7075DB]">
                Login
              </p>
            </div>
            <div className="flex flex-col w-[70%] gap-6">
              <div className="w-full rounded-lg border-2 border-[#1C1B1F] font-poppins font-normal text-lg p-1">
                <input
                  type="email"
                  placeholder="Email"
                  className="py-1 px-2 bg-transparent w-[94.5%] outline-none"
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>
              <div>
                <div className="w-full rounded-lg border-2 border-[#1C1B1F] font-poppins font-normal text-lg py-1 pl-1 pr-2 flex flex-row justify-between items-center">
                  <input
                    type="password"
                    placeholder="Password"
                    className="py-1 px-2 bg-transparent w-[100%] outline-none"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 11 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                  >
                    {/* SVG path here */}
                  </svg>
                </div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 border-2 rounded focus:ring-blue-500 "
                  />
                  <label
                    htmlFor="checkbox"
                    className=" text-[#313131] text-sm font-poppins font-medium my-auto"
                  >
                    Remember Me
                  </label>
                </div>
                <p className="font-poppins font-medium text-sm text-[#FF8682] cursor-pointer">
                  Forgot Password
                </p>
              </div>
              <button
                className="w-[100%] bg-[#7075DB] font-poppins font-medium text-sm text-white p-3 rounded-lg"
                onClick={handleLoginchange}
              >
                Login
              </button>
              {status && <div>{status}</div>}
            </div>
            <div className="w-[70%] flex flex-col justify-center items-center gap-6">
              <div className="w-full flex flex-row items-center gap-2 justify-center opacity-35">
                <div className="w-1/3 h-[0.5px] rounded-full bg-[#313131]" />
                <p className="font-poppins font-normal text-base text-[#313131]">
                  Or login with
                </p>
                <div className="w-1/3 h-[0.5px] rounded-full bg-[#313131]" />
              </div>
              <div>
                <div
                  className="px-14 py-2 rounded-lg border-[#3869EB] border-[1.8px] cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={handleGoogleLogin}
                >
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1345_4157)">
                      <path
                        d="M8.90368 4.11288H8.59089V4.09676H5.09605V5.65003H7.29062C6.97045 6.55422 6.11014 7.20329 5.09605 7.20329C3.80937 7.20329 2.76615 6.16008 2.76615 4.87339C2.76615 3.58671 3.80937 2.5435 5.09605 2.5435C5.68998 2.5435 6.23032 2.76756 6.64174 3.13354L7.74009 2.03519C7.04656 1.38884 6.11887 0.990234 5.09605 0.990234C2.95158 0.990234 1.21289 2.72892 1.21289 4.87339C1.21289 7.01787 2.95158 8.75655 5.09605 8.75655C7.24053 8.75655 8.97921 7.01787 8.97921 4.87339C8.97921 4.61303 8.95242 4.35888 8.90368 4.11288Z"
                        fill="#FFC107"
                      />
                      <path
                        d="M1.66016 3.06598L2.93597 4.00163C3.28118 3.14694 4.11723 2.5435 5.09559 2.5435C5.68952 2.5435 6.22986 2.76756 6.64128 3.13354L7.73963 2.03519C7.0461 1.38884 6.11841 0.990234 5.09559 0.990234C3.60407 0.990234 2.31059 1.8323 1.66016 3.06598Z"
                        fill="#FF3D00"
                      />
                      <path
                        d="M5.09566 8.7562C6.09868 8.7562 7.01005 8.37235 7.69912 7.74813L6.49728 6.73113C6.09432 7.03759 5.60191 7.20334 5.09566 7.20294C4.08565 7.20294 3.22805 6.55891 2.90497 5.66016L1.63867 6.6358C2.28133 7.89336 3.58647 8.7562 5.09566 8.7562Z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M8.90334 4.11279H8.59055V4.09668H5.0957V5.64994H7.29027C7.13712 6.08028 6.86125 6.45632 6.49675 6.7316L6.49733 6.73121L7.69917 7.74821C7.61413 7.82548 8.97886 6.81489 8.97886 4.87331C8.97886 4.61295 8.95207 4.35879 8.90334 4.11279Z"
                        fill="#1976D2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1345_4157">
                        <rect
                          width="9.31958"
                          height="9.31958"
                          fill="white"
                          transform="translate(0.435547 0.212891)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {emailNotFound && (
                  <p>Email not found. Please register first.</p>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-[45%] h-full rounded-l-[50px] bg-black">
            <div className="w-full h-full object-fit">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 255 323"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="rounded-l-[50px] object-fit"
              >
                <path
                  d="M0 16.3861C0 7.33632 7.33632 0 16.3861 0L274.614 0C283.664 0 291 7.33633 291 16.3861V317.614C291 326.664 283.664 334 274.614 334H16.3861C7.33633 334 0 326.664 0 317.614L0 16.3861Z"
                  fill="#7075DB"
                />
                <circle cx="24.5" cy="72.5" r="5.5" fill="#F0F0F0" />
                <path
                  d="M214 173C214 215.526 178.854 250 135.5 250C92.1456 250 57 215.526 57 173C57 130.474 92.1456 96 135.5 96C178.854 96 214 130.474 214 173Z"
                  fill="#8B91FF"
                />
                <mask id="path-4-inside-1_1364_1201" fill="white">
                  <path d="M183.839 82.5007C194.216 84.9556 204.002 89.7661 212.502 96.5904C221.002 103.415 228.006 112.085 233.018 121.986C238.03 131.887 240.926 142.775 241.5 153.877C242.075 164.978 240.314 176.021 236.342 186.22L228.016 182.489C231.493 173.56 233.034 163.893 232.531 154.175C232.028 144.456 229.493 134.924 225.106 126.257C220.718 117.589 214.586 109.999 207.145 104.024C199.704 98.0501 191.137 93.8388 182.053 91.6898L183.839 82.5007Z" />
                </mask>
                <path
                  d="M183.839 82.5007C194.216 84.9556 204.002 89.7661 212.502 96.5904C221.002 103.415 228.006 112.085 233.018 121.986C238.03 131.887 240.926 142.775 241.5 153.877C242.075 164.978 240.314 176.021 236.342 186.22L228.016 182.489C231.493 173.56 233.034 163.893 232.531 154.175C232.028 144.456 229.493 134.924 225.106 126.257C220.718 117.589 214.586 109.999 207.145 104.024C199.704 98.0501 191.137 93.8388 182.053 91.6898L183.839 82.5007Z"
                  stroke="#E0E0E0"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  mask="url(#path-4-inside-1_1364_1201)"
                />
                <circle cx="49.5" cy="90.5" r="5.5" fill="white" />
                <circle cx="74.5" cy="49.5" r="9.5" fill="#8B91FF" />
              </svg>
              <img
                src={Doc}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[50%] h-[90%] object-cover rounded-l-[50px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
