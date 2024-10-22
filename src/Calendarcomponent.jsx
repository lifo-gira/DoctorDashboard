import React from "react";
import Calendar from "color-calendar";
import "color-calendar/dist/css/theme-glass.css";
import "./calendarStyles.css";

class CalendarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
    };
  }

  componentDidMount() {
    // Fetch patient data when the component mounts
    this.fetchPatientData();
  }

  fetchPatientData = async () => {
    try {
      const response = await fetch(
        "https://api-wo6.onrender.com/patient-details/all"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
      const data = await response.json();
  
      // Retrieve doctor_id from localStorage
      const doctorId = localStorage.getItem("_id");
  
      // Filter patients based on doctor_id
      const filteredPatients = data.filter(patient => patient.doctor_id === doctorId);
  
      // Set the patients state with the filtered data
      this.setState({ patients: filteredPatients }, () => {
        // Update the calendar with new event data after fetching patients
        this.updateCalendarEvents();
      });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };
  

  updateCalendarEvents = () => {
    const { patients } = this.state;

    // Extract events from patients' events_date and format them
    const eventsData = patients.flatMap(
      (patient, index) =>
        patient.events_date
          .map((date) => {
            // Convert the string representation of the date into a valid Date object
            const dateMatch = date.match(/\(([^)]+)\)/);
            if (!dateMatch) return null; // Skip if no match

            const dateParts = dateMatch[1].split(",").map(Number); // Convert to an array of numbers
            // Use the month as provided (1-12)
            const formattedDate = new Date(
              Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])
            ); // Subtract 1 from month to align with JavaScript Date

            // Log the formatted date
            // console.log("Formatted Date:", formattedDate.toISOString());

            // Create start and end dates
            const startDate = formattedDate.toISOString(); // Start of the event (the actual date)
            const endDate = new Date(formattedDate); // Create a new date object based on the formatted date
            endDate.setHours(23, 59, 59, 999); // Set to the end of the day

            return {
              id: patient._id.$oid + index, // Unique ID
              name: `Patient: ${patient.user_id}`, // Customize as needed
              start: startDate, // Use the formatted date for start
              end: endDate.toISOString(), // Set to the end of the day
              color: "#FF0000", // Customize color if needed
            };
          })
          .filter((event) => event !== null) // Filter out any null events
    );

    // Initialize the calendar with the new event data
    this.initializeCalendar(eventsData);
  };

  initializeCalendar = (eventsData) => {
    // Initialize the calendar
    new Calendar({
      id: "#myCal",
      theme: "glass",
      primaryColor: "#FF0000",
      headerBackgroundColor: "#ffffff",
      headerColor: "#000000",
      textColor: "#000000",
      weekdayType: "short",
      monthDisplayType: "long",
      calendarSize: "small",
      fontFamilyHeader: "Poppins-bold",
      fontFamilyBody: "Poppins-medium",
      fontFamilyWeekdays: "Poppins-medium",
      layoutModifiers: ["month-left-align"],
      eventsData: eventsData, // Pass formatted events data
      // dateChanged: (currentDate, events) => {
      //   console.log("date change", currentDate, events);
      // },
      // monthChanged: (currentDate, events) => {
      //   console.log("month change", currentDate, events);
      // },
    });
  };

  convertDateToCustomFormat = (isoString) => {
    const date = new Date(isoString);

    // Pad single-digit month, day, hours, and minutes with leading zeros
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Optional seconds

    // Return the formatted date string in the desired format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  render() {
    return <div id="myCal"></div>;
  }
}

export default CalendarComponent;
