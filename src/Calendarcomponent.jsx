import React from "react";
import Calendar from "color-calendar";
import "color-calendar/dist/css/theme-glass.css";
import "./calendarStyles.css";

class CalendarComponent extends React.Component {
  componentDidMount() {
    new Calendar({
      id: "#myCal",
      theme: "glass",
      primaryColor: "#FF0000", // Red event dots
      headerBackgroundColor: "#ffffff", // Black header background
      headerColor: "#000000", // White header text
      textColor: "#000000", // Light gray text for days and week labels
      weekdayType: "short", // Short weekday names to match the image
      monthDisplayType: "long",
      calendarSize: "small",
      fontFamilyHeader:"Poppins-bold",
      fontFamilyBody:"Poppins-medium",
      fontFamilyWeekdays:"Poppins-medium",
      layoutModifiers: ["month-left-align"],
      eventsData: [
        {
          id: 1,
          name: "Event 1",
          start: "2024-10-08T10:00:00",
          end: "2024-10-08T11:00:00",
          color: "#FF0000" // Red dot for event
        },
        {
          id: 2,
          name: "Event 2",
          start: "2024-10-14T10:00:00",
          end: "2024-10-14T11:00:00",
          color: "#FF0000" // Red dot for event
        }
      ],
      dateChanged: (currentDate, events) => {
        console.log("date change", currentDate, events);
      },
      monthChanged: (currentDate, events) => {
        console.log("month change", currentDate, events);
      }
    });
  }

  render() {
    return <div id="myCal"></div>; // Black background for the calendar
  }
}

export default CalendarComponent;
