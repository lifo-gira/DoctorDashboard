import React, { useEffect, useState } from "react";
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
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query

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
        end: new Date(date.getTime() + 2 * 60 * 60 * 1000), // Set end date 2 hours later
        color: "green", // Set event color
        avatars: [Porfileimg, Porfileimg], // Add your avatar images
      }));

      setEvents(formattedEvents); // Set the formatted events
      console.log(formattedEvents); // Log only the formatted events

    } catch (error) {
      console.error("Error fetching patient information:", error);
    }
  };

  fetchData();
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
                placeholder="Search Event"
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
          </div>
        </div>
        <div className="flex items-center justify-end w-[40%]">
          <img src={Porfileimg} alt="Profile" className="w-12 h-12 rounded-full" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded ml-4">
            Add Event
          </button>
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
