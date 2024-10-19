import React, { useEffect, useRef, useState } from "react";
import "./events.css";
import Porfileimg from "./Assets/profile.png";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/en-gb";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Topic",
    start: new Date(2024, 10, 12, 9, 0), // Feb 12, 9:00 AM
    end: new Date(2024, 10, 12, 11, 0), // Feb 12, 11:00 AM
    color: "green",
    avatars: [Porfileimg, Porfileimg],
  },
  // Add more events here...
];

// Custom event rendering with color and avatars
const eventStyleGetter = (event) => {
  let backgroundColor, borderColor, textColor, minHeight, maxHeight;

  if (event.color === "green") {
    backgroundColor = "#e0f7e9";
    borderColor = "#29a744";
    textColor = "#29a744";
  } else if (event.color === "orange") {
    backgroundColor = "#ffe9d6";
    borderColor = "#ff5733";
    textColor = "#ff5733";
  } else if (event.color === "yellow") {
    backgroundColor = "#fff9d6";
    borderColor = "#ffcc00";
    textColor = "#ffcc00";
  }

  return {
    style: {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      color: textColor,
      height: "80px",
      borderRadius: "10px",
      padding: "5px",
      margin: "7px",
    },
  };
};

const CustomEvent = ({ event }) => {
  const { style } = eventStyleGetter(event);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-1" style={style}>
      <div>{event.title}</div>
      <div className="flex flex-row justify-center items-center gap-4">
        {event.avatars.map((avatar, index) => (
          <img key={index} src={avatar} alt="avatar" className="w-6 h-6" />
        ))}
      </div>
    </div>
  );
};

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };

  const viewButtons = ["Agenda", "Month", "Week", "Day"];

  return (
    <div className="custom-toolbar">
      {/* Left side: Today, Back, and Next buttons */}
      <div className="nav-buttons">
        <button onClick={goToToday}>Today</button>
      </div>

      <div className="flex flex-row items-center gap-3">
        {/* Center: Date display */}
        <div onClick={goToBack} className="fb">
          {"<"}
        </div>
        <div className="date-display">{toolbar.label}</div>
        <div onClick={goToNext} className="fb">
          {">"}
        </div>
      </div>

      {/* Right side: Year, Month, Week, Day view buttons */}
      <div className="flex flex-row gap-5 bg-white text-[#ADB8CC] text-sm py-2 px-4 rounded-full">
        {viewButtons.map((view) => (
          <div
            key={view}
            className={`cursor-pointer ${toolbar.view === view.toLowerCase() ? "active" : ""}`}
            onClick={() => toolbar.onView(view.toLowerCase())}
          >
            {view}
          </div>
        ))}
      </div>
    </div>
  );
};

const Events = () => {
  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var userName = parsedData.user_id;
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]); // State for events

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
      setLoading(false);
      // Process event dates and create events array
      const allEventDates = data.reduce((acc, patient) => {
        if (patient.events_date) {
          const parsedDates = patient.events_date.map(dateString => {
            const dateParts = dateString.match(/\d+/g); // Extract numbers
            if (dateParts) {
              // Use dateParts[0] - 1 for month to match 1 for January, 2 for February, etc.
              return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]), Number(dateParts[3]), Number(dateParts[4])); // Convert to Date
            }
            return null; // Return null if parsing fails
          }).filter(Boolean); // Remove null values
          return [...acc, ...parsedDates]; // Combine with accumulated dates
        }
        return acc; // Return accumulated dates
      }, []);

      // Map event dates to events format
      const formattedEvents = allEventDates.map((date, index) => ({
        title: `Event ${index + 1}`, // Customize event title as needed
        start: date, // Set start date
        end: date, // Set end date 2 hours later
        color: "green", // Set event color
        avatars: [Porfileimg, Porfileimg], // Add your avatar images
      }));

      setEvents(formattedEvents); // Set the formatted events
      console.log(formattedEvents); // Log only the formatted events

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

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

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
          <button className="focus:outline-none w-8 h-8 rounded-full mr-7">
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
                fill-opacity="0.75"
              />
              <circle cx="19.0022" cy="5.63308" r="2.80496" fill="#F9A135" />
            </svg>
          </button>
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
      <div className="h-[85%] w-[95%] mx-auto mt-6 flex flex-col gap-5">
        <div className="flex flex-row w-full h-[12%] justify-between">
          <p className="text-black text-2xl font-poppins font-semibold">Schedule</p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-poppins font-semibold text-sm text-[#475467]">Total Patients for Today</p>
            <p className="font-poppins font-semibold text-3xl text-[#475467]">{patients.length}</p> {/* Update this to show the count */}
          </div>
        </div>
        <div className="h-[88%] w-full overflow-auto">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar,
            }}
            eventPropGetter={eventStyleGetter}
            style={{ height: 700, fontFamily: "Poppins" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
