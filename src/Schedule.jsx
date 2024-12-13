import React, { useState, useEffect, useRef } from "react";
import Porfileimg from "./Assets/profile.png";
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { AreaChart, Area } from "recharts";
import VideoCall from "./VideoCall";

const Schedule = ({setCurrentPage,toReportPage}) => {
  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var userName = parsedData.user_id;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [showDetails, setShowDetails] = useState(false); // State to control the details view
  const [isVideoCallVisible, setIsVideoCallVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api-wo6.onrender.com/patient-details/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
  
        // Retrieve doctor_id from localStorage
        const doctorId = localStorage.getItem("_id");
  
        // Filter patients based on doctor_id
        const filteredPatients = data.filter(patient => patient.doctor_id === doctorId);
  
        setPatients(filteredPatients); // Set the filtered patients
        setLoading(false);
  
        // Count occurrences of flag == -1 and flag == 0 in filtered patients
        const minusOneCount = filteredPatients.filter(
          (patient) => patient.flag === -1
        ).length;
        const zeroCount = filteredPatients.filter((patient) => patient.flag === 0).length;
  
  
        console.log("Processed patient data:", filteredPatients); // Log fetched and processed data
      } catch (error) {
        console.error("Error fetching patient information:", error);
        setLoading(true);
      }
    };
  
    fetchData();
  }, []);
  

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeDropdown = () => setDropdownOpen(false);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPatients = searchQuery
    ? patients.filter((patient) =>
        patient.user_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const findNearestEventDate = (eventDates) => {
    const today = new Date();
    const futureDates = eventDates
      .map((date) => new Date(date))
      .filter((date) => date >= today); // Filter dates that are today or in the future

    // Sort dates and return the nearest one, if available
    return futureDates.length > 0 ? futureDates.sort((a, b) => a - b)[0] : null;
  };

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const data1 = [
    { name: "Group A", value: 1, color: "#FFB547" }, // Orange
    { name: "Group B", value: 1, color: "#A162F7" }, // Purple
    { name: "Group C", value: 1, color: "#FF6A88" }, // Red
    { name: "Group D", value: 1, color: "#F2F3F5" }, // Gray (incomplete part)
  ];

  const total = data1.length - 1;

  const data2 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    if (notificationCount > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("wss://api-wo6.onrender.com/patients");

    socket.onmessage = (event) => {
        // Handle the WebSocket message
        console.log("WebSocket message received:", event.data);

        try {
            const messageData = JSON.parse(event.data);
            console.log(messageData, "HI");
            // Check if the flag is 1 in the received message
            if (messageData.flag === 3) {
                // Increment the notification count when a new WebSocket message is received with flag 1
                setNotificationCount((prevCount) => prevCount + 1);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    // Return cleanup function to close socket when component unmounts
    return () => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    };
}, []);

  return (
    <div className="w-full h-full">
      <div className="flex w-[95%] mx-auto mt-4">
        <div className="flex w-[60%] h-full">
          <div className="relative w-full">
            {/* Search Input */}
            <div className="w-full bg-gray-200 rounded-xl px-4 py-2 flex items-center">
              <input
                className="bg-transparent w-full outline-none text-gray-600 py-2"
                type="text"
                placeholder="Search by user ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchQuery(searchQuery)} // Keep dropdown open on focus
              />
              <button className="focus:outline-none ml-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.228 14.1777L17.7282 16.6766C17.8447 16.7973 17.9093 16.959 17.9078 17.1268C17.9063 17.2947 17.839 17.4552 17.7204 17.5739C17.6017 17.6925 17.4411 17.7599 17.2733 17.7613C17.1055 17.7628 16.9438 17.6983 16.8231 17.5817L14.3229 15.0815C12.6891 16.4813 10.5766 17.1939 8.42878 17.0697C6.28092 16.9456 4.26463 15.9943 2.803 14.4156C1.34138 12.8369 0.548028 10.7534 0.589434 8.60235C0.63084 6.4513 1.50378 4.3999 3.02508 2.8786C4.54638 1.3573 6.59779 0.484355 8.74883 0.442949C10.8999 0.401543 12.9834 1.19489 14.5621 2.65652C16.1408 4.11815 17.092 6.13444 17.2162 8.2823C17.3404 10.4302 16.6278 12.5426 15.228 14.1764V14.1777ZM8.90908 15.8035C10.7764 15.8035 12.5673 15.0617 13.8878 13.7413C15.2082 12.4209 15.95 10.63 15.95 8.7626C15.95 6.89523 15.2082 5.10434 13.8878 3.78392C12.5673 2.46349 10.7764 1.72168 8.90908 1.72168C7.04171 1.72168 5.25083 2.46349 3.9304 3.78392C2.60997 5.10434 1.86816 6.89523 1.86816 8.7626C1.86816 10.63 2.60997 12.4209 3.9304 13.7413C5.25083 15.0617 7.04171 15.8035 8.90908 15.8035Z"
                    fill="#A2A3A4"
                  />
                </svg>
              </button>
            </div>

            {/* Dropdown for filtered patients */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              searchQuery && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full bg-white shadow-lg mt-1 rounded-lg max-h-60 overflow-y-auto"
                >
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient._id}
                        className="p-2 border-b hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedPatient(patient); // Set the selected patient
                          setSearchQuery(""); // Clear search query after selection
                          closeDropdown(); // Close dropdown after selection
                        }}
                      >
                        <p>{patient.user_id}</p>
                        {/* You can add more patient details here */}
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-gray-600">No results found.</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex items-center justify-end w-[40%]">
          <button className="focus:outline-none w-8 h-8 rounded-full mr-7">
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.6293 19.374C24.2478 18.2471 24.5782 16.9848 24.5911 15.6993C24.604 14.4139 24.299 13.1452 23.7032 12.0061C23.1074 10.867 22.2394 9.8928 21.1762 9.17017C20.113 8.44754 18.8877 7.99888 17.6093 7.86411C17.2035 6.88667 16.6031 6.00203 15.8446 5.26404C15.086 4.52605 14.1853 3.95014 13.197 3.57137C12.2088 3.19259 11.1539 3.01888 10.0964 3.06081C9.03894 3.10274 8.00105 3.35942 7.04594 3.81524C6.09082 4.27106 5.23845 4.91648 4.54072 5.71221C3.84299 6.50794 3.31449 7.43734 2.98739 8.44383C2.66028 9.45032 2.54142 10.5128 2.63804 11.5667C2.73466 12.6206 3.04474 13.6438 3.54939 14.5741L2.9094 16.824C2.85171 17.0292 2.84971 17.2461 2.90361 17.4523C2.95751 17.6585 3.06536 17.8466 3.21608 17.9974C3.36679 18.1481 3.55493 18.2559 3.76114 18.3098C3.96735 18.3637 4.1842 18.3617 4.38939 18.304L6.63937 17.664C7.54467 18.1636 8.54099 18.4764 9.56936 18.584C9.98593 19.6005 10.6125 20.5175 11.4081 21.2749C12.2036 22.0324 13.1502 22.6133 14.1858 22.9796C15.2214 23.3459 16.3227 23.4893 17.4176 23.4005C18.5125 23.3116 19.5763 22.9925 20.5393 22.464L22.7893 23.104C22.9948 23.1652 23.213 23.1697 23.4209 23.117C23.6288 23.0644 23.8185 22.9565 23.9702 22.8049C24.1218 22.6533 24.2296 22.4635 24.2823 22.2556C24.3349 22.0478 24.3304 21.8295 24.2693 21.624L23.6293 19.374ZM6.71937 16.4141C6.66134 16.4135 6.6037 16.4236 6.54937 16.4441L4.05939 17.154L4.76939 14.6641C4.79435 14.5861 4.80191 14.5036 4.79154 14.4224C4.78118 14.3412 4.75313 14.2633 4.70939 14.1941C3.89109 12.8131 3.60498 11.1809 3.90475 9.60397C4.20453 8.02701 5.06958 6.61368 6.33752 5.6293C7.60546 4.64492 9.1891 4.15717 10.7912 4.25762C12.3932 4.35807 13.9035 5.03981 15.0386 6.17486C16.1736 7.30991 16.8554 8.82022 16.9558 10.4223C17.0563 12.0243 16.5685 13.608 15.5841 14.8759C14.5998 16.1439 13.1864 17.0089 11.6095 17.3087C10.0325 17.6085 8.40034 17.3223 7.01937 16.5041C6.93021 16.4456 6.82598 16.4143 6.71937 16.4141V16.4141ZM22.4093 19.464L23.1193 21.954L20.6293 21.244C20.5513 21.2191 20.4688 21.2115 20.3876 21.2219C20.3064 21.2322 20.2285 21.2603 20.1593 21.304C19.3811 21.7642 18.5168 22.0599 17.6199 22.1727C16.7229 22.2856 15.8123 22.2133 14.9444 21.9602C14.0764 21.7072 13.2697 21.2787 12.5739 20.7015C11.8782 20.1242 11.3082 19.4103 10.8993 18.604C12.8741 18.4723 14.7251 17.5957 16.0784 16.1515C17.4316 14.7073 18.1861 12.8032 18.1893 10.8241C18.187 10.2556 18.1233 9.68894 17.9993 9.1341C19.0432 9.33017 20.0245 9.77491 20.86 10.4307C21.6955 11.0864 22.3608 11.9338 22.7993 12.9012C23.2379 13.8686 23.4368 14.9274 23.3794 15.988C23.3219 17.0486 23.0098 18.0797 22.4693 18.994C22.4255 19.0632 22.3975 19.1412 22.3871 19.2224C22.3768 19.3036 22.3843 19.3861 22.4093 19.464V19.464Z"
                fill="#0D0D0D"
                fill-opacity="0.75"
              />
            </svg>
          </button>
          <div className="relative">
            {/* Notification Button */}
            <button
              className="focus:outline-none w-8 h-8 rounded-full mr-7 relative"
              onClick={toggleDropdown}
            >
              <svg
                width="26"
                height="27"
                viewBox="0 0 26 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9632 23.8898C13.6238 23.8907 14.2682 23.6857 14.8069 23.3033C15.3456 22.921 15.7518 22.3804 15.9691 21.7565H9.95737C10.1746 22.3804 10.5808 22.921 11.1195 23.3033C11.6582 23.6857 12.3026 23.8907 12.9632 23.8898ZM20.4298 15.9816V11.0899C20.4298 7.65847 18.0992 4.76783 14.9419 3.8985C14.6293 3.1113 13.8656 2.55664 12.9632 2.55664C12.0608 2.55664 11.2971 3.1113 10.9846 3.8985C7.82725 4.76889 5.4966 7.65847 5.4966 11.0899V15.9816L3.67581 17.8024C3.57657 17.9013 3.49786 18.0188 3.44423 18.1483C3.39059 18.2777 3.36308 18.4164 3.36328 18.5565V19.6232C3.36328 19.9061 3.47566 20.1774 3.6757 20.3774C3.87574 20.5775 4.14705 20.6899 4.42994 20.6899H21.4965C21.7794 20.6899 22.0507 20.5775 22.2507 20.3774C22.4508 20.1774 22.5632 19.9061 22.5632 19.6232V18.5565C22.5634 18.4164 22.5359 18.2777 22.4822 18.1483C22.4286 18.0188 22.3499 17.9013 22.2506 17.8024L20.4298 15.9816Z"
                  fill="#0D0D0D"
                  fillOpacity="0.75"
                />
                <circle cx="19.0022" cy="5.63308" r="2.80496" fill="#F9A135" />
              </svg>
              {/* Notification Badge */}
              <div className="absolute top-[-5px] right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </div>
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 bg-white border rounded-md shadow-md w-64 p-4">
                 <p 
            className="text-sm text-gray-700"
            onClick={() => {
                window.location.reload()
            }}
          >You have a notification</p>
              </div>
            )}
          </div>
          <div className="h-12 w-40 bg-white border-[#D9D9D9] border-[1.5px] rounded-2xl ">
            <div className="h-full flex flex-row gap-4 justify-center items-center">
              <img
                src={Porfileimg}
                alt="Profile"
                className="w-8 h-8 rounded-full "
              />
              <h2 className="text-base font-semibold text-gray-800 flex items-center">
                {userName}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row h-[85%] w-[95%] mx-auto mt-6">
  <div className="w-[70%] h-full pr-10">
    <p className="text-black text-lg font-poppins font-semibold">
      Patients Assigned
    </p>
    {patients.map((patient) => (
      <div
        key={patient._id} // Change to patient._id for consistency
        className={`w-full rounded-lg flex flex-row justify-between items-center my-1 py-2 px-3 mt-6 cursor-pointer ${
          selectedPatient && selectedPatient._id === patient._id ? "bg-[#F0ECFF]" : "bg-white"
        }`} // Apply the background color conditionally
        onClick={() => handlePatientClick(patient)}
      >
        <div className="w-3/6">
          <div className="flex flex-row gap-4 py-0 px-2 items-center">
            <img
              className="w-10 h-10 rounded-full"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
              alt={patient.user_id}
            />
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <p className="text-[#475467] font-poppins font-medium text-base">
                  {patient.user_id}
                </p>
              </div>
              <p className="text-start font-poppins font-medium text-sm text-[#475467]">
                {patient.PersonalDetails.Age},{" "}
                {patient.PersonalDetails.Gender}
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/6 text-sm font-normal font-poppins text-[#475467] text-center">
          ID: {patient.unique_id}
        </div>

        {/* Updated Additional Info Section for pain indication */}
        <div className="w-1/6">
          <div className="bg-[#BAE5F6] text-[#0D3CB7] rounded-lg px-2 py-1 text-sm text-center">
            {patient.PersonalDetails.pain_indication.map((report, index) => (
              <div key={index}>
                {report && (
                  <div>
                    <span>{report}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/6 flex flex-row justify-end items-center">
          <div className="flex flex-row gap-1 items-center" onClick={() => {
          setCurrentPage("reports"); // Set the current page to reports
          toReportPage(patient); // Pass the mapped patient data here
          console.log(patient); // For debugging, you can remove this later
        }}>
            <div className="text-sm font-medium border-b-2 text-[#476367] border-blue-gray-500 cursor-pointer">
              Report
            </div>
            <ArrowUpRightIcon
              color="blue"
              className="w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="w-[30%] h-full mx-auto">
    {selectedPatient ? (
      <>
        <div className="w-full h-[28%]">
          <p className="text-[#475467] text-lg font-poppins font-medium">
            Patient Details
          </p>
          <div className="w-full flex flex-col mt-2 bg-white rounded-lg py-2 gap-4">
            <div className="w-full flex flex-row gap-3 px-4">
              <img
                className="w-10 h-10 rounded-full"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                alt={selectedPatient.user_id}
              />
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-[#7075DB] font-poppins font-medium text-base">
                    {selectedPatient.user_id}
                  </p>
                </div>
                <p className="text-start font-poppins font-normal text-sm opacity-50 text-[#475467]">
                  {selectedPatient.PersonalDetails.Age},{" "}
                  {selectedPatient.PersonalDetails.Gender}
                </p>
              </div>
              <div className="px-4 mt-2">
            <VideoCall doctorId={selectedPatient.patient_id} />
          </div>

            </div>
            <div className="h-[1px] w-full opacity-15 bg-[#475467]"></div>
            <div className="w-full flex flex-row px-4 justify-between">
              <p className="text-[#475467] text-xs font-poppins font-normal italic flex flex-row gap-1">
                Diagnosis:
                <span className="text-black font-medium">
                  {selectedPatient.PersonalDetails.pain_indication.map(
                    (report, index) => (
                      <div key={index}>
                        {report && (
                          <div>
                            <span>{report}</span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </span>
              </p>
              {selectedPatient.events_date.length > 0 && (
                <p className="text-[#475467] opacity-50 text-xs font-poppins font-medium flex flex-col gap-1 justify-end items-end">
                  Event:{" "}
                  {findNearestEventDate(selectedPatient.events_date)
                    ? new Date(
                        findNearestEventDate(selectedPatient.events_date)
                      ).toLocaleDateString()
                    : "No upcoming events"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[72%]">
          <p className="text-black text-lg font-poppins font-medium">
            Dashboard
          </p>
          <div className="w-full h-full flex flex-col gap-3">
            <div className="w-full h-[45%] flex flex-row">
              <div className="w-[50%] h-full flex flex-col justify-center bg-white rounded-xl mr-4">
                <p className="text-[#202224] text-sm font-poppins font-medium px-2">
                  Patient Analytics
                </p>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart
                    width={200}
                    height={200}
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="0 1" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "Poppins", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "Poppins", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontFamily: "Poppins",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="natural"
                      dataKey="pv"
                      stroke="#8884d8"
                      strokeDasharray="5 5"
                    />
                    <Line type="natural" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-[50%] h-full flex flex-col justify-center bg-white rounded-xl ml-4">
                <p className="text-[#202224] text-sm font-poppins font-medium px-2">
                  Completed
                </p>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={data1}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      stroke="none"
                    >
                      {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {/* Central label */}
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="24"
                      fontFamily="Poppins"
                      fontWeight="bold"
                    >
                      3/4
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-full h-[45%] bg-[#2D558F] rounded-lg flex flex-col justify-center gap-3 px-4">
              <p className="text-white text-base font-poppins font-medium">
                Performance
              </p>
              <ResponsiveContainer width="100%" height="70%">
                <AreaChart data={data2}>
                  <CartesianGrid strokeDasharray="0 1" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontFamily: "Poppins", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontFamily: "Poppins", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Poppins",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-500">
        Select a patient to view details.
      </p>
    )}
  </div>
</div>

    </div>
  );
};

export default Schedule;
