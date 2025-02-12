import React, { useState, useEffect, useMemo } from "react";
import "./detailreport.css";

import Porfileimg from "./Assets/profile.png";
import User from "./Assets/user.png";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

import { Box, Button, Paper } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import { DataGrid } from "@mui/x-data-grid";

const Detailreport = (assessment, index, reportData, selected) => {
  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var userName = parsedData.user_id;
  const [isFirstRender, setIsFirstRender] = useState(true);

  // This effect runs after the first render
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const calculateProgress = () => {
    const exercises =
      assessment.selected === "assessment"
        ? assessment.assessment.exercises
        : assessment.selected === "model_recovery"
        ? assessment.assessment.Exercise
        : {};

    console.log(assessment.assessment.exercises);

    let totalExercises, definedExercisesCount;

    if (assessment.selected === "assessment") {
      totalExercises = 7;

      // Count only exercises that have non-empty arrays with key-value pairs
      definedExercisesCount = Object.values(
        assessment.assessment.exercises
      ).filter((exerciseObject) => {
        // For each exercise object, we check if any of the arrays inside contain key-value pairs
        return Object.values(exerciseObject).some((exerciseArray) => {
          return (
            Array.isArray(exerciseArray) &&
            exerciseArray.some((item) => Object.keys(item).length > 0)
          );
        });
      }).length;
    } else {
      totalExercises = Object.keys(
        assessment.reportData.Exercise_Assigned
      ).length;
      definedExercisesCount = Object.keys(exercises).length;
    }
    // Calculate the completion percentage based on defined exercises
    const progress = (definedExercisesCount / totalExercises) * 100;

    // Calculate remaining exercises as total minus defined
    const remaining = totalExercises - definedExercisesCount;
    // console.log(definedExercisesCount);
    return {
      progress,
      remaining,
    };
  };

  // Get the calculated progress and remaining values
  const { progress, remaining } = calculateProgress();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSelectedItem, setDrawerSelectedItem] = useState(null);
  const [drawerItems, setDrawerItems] = useState([]); // Initialize with an empty array
  const [selectedExerciseData, setSelectedExerciseData] = useState([]);
  const [isCycleOpen, setIsCycleOpen] = useState(false);
  const [cycleSelectedItem, setCycleSelectedItem] = useState(null);
  const [exerciseName, setExerciseName] = useState(""); // Empty initially
  const [selectionName, setSelectionName] = useState(""); // Empty initially
  const [selectionData, setSelectionData] = useState({}); // Empty initially
  const [cycleOptions, setCycleOptions] = useState({}); // Empty initially
  const [selectedCycle, setSelectedCycle] = useState(null);

  const handleCycleSelect = (
    exerciseName,
    selectionName,
    cycleSelectedData, // Renaming selectionData to cycleSelectedData for clarity
    cycleCount
  ) => {
    const newCycleOptions = {}; // Create a new object for the cycle options
    console.log("Cycle Selected Data:", cycleSelectedData); // Log cycleSelectedData for debugging

    // Loop through the cycle count and create cycle options
    for (let i = 1; i <= cycleCount; i++) {
      newCycleOptions[`cycle-${i}`] = `Cycle ${i}`; // "cycle-1" -> "Cycle 1"
    }

    // Now, newCycleOptions contains the dynamic options, and we update the state
    setCycleOptions(newCycleOptions); // This triggers a re-render

    // Ensure selectionData is initialized as an array
    setSelectionData((prevSelectionData) => {
      // If prevSelectionData is not an array, initialize it as an empty array
      const updatedSelectionData = Array.isArray(prevSelectionData)
        ? prevSelectionData
        : [];

      // Append the new cycle data to the existing selectionData
      updatedSelectionData.push(cycleSelectedData);

      console.log("Updated Selection Data:", updatedSelectionData);

      return updatedSelectionData;
    });
  };

  const handleCycleData = (selectionData, exerciseName, cycleSelectedItem) => {
    console.log("Selection Data:", selectionData);
    console.log(exerciseName);
    console.log("cycleSelectedItem:", cycleSelectedItem);
    if (
      exerciseName === "Mobility Test" ||
      exerciseName === "Walk and Gait Analysis" ||
      exerciseName === "Extension Lag Test" ||
      exerciseName === "Proprioception Test"
    ) {
      // Extract the cycle number from the cycleSelectedItem, e.g., "cycle-1" -> 1
      const selectedCycleNumber = parseInt(cycleSelectedItem.split("-")[1], 10);
      console.log(selectedCycleNumber);

      // Access the cycle data using the dynamic key (`cycle-1`, `cycle-2`, etc.)
      const selectedCycleData = selectionData[selectedCycleNumber - 1]; // Access the cycle data for the selected cycle
      console.log(selectionData);

      if (selectedCycleData) {
        // Get left leg and right leg data for the selected cycle (use only the first array in the list)
        const leftLegData = selectedCycleData.leftLegData[0] ?? []; // Use only the first array
        const rightLegData = selectedCycleData.rightLegData[0] ?? []; // Use only the first array

        console.log(
          `Left Leg Data for Cycle ${selectedCycleNumber}:`,
          leftLegData
        );
        console.log(
          `Right Leg Data for Cycle ${selectedCycleNumber}:`,
          rightLegData
        );

        // Ensure both arrays have the same length for plotting
        const maxLength = Math.max(leftLegData.length, rightLegData.length);
        const selectedExerciseData = [];

        // Create data for both left leg and right leg
        for (let i = 0; i < maxLength; i++) {
          selectedExerciseData.push({
            name: `${i + 1}`, // Dynamic point names
            value1: leftLegData[i] ?? 0, // Left leg proprioception data (default to 0 if missing)
            value2: rightLegData[i] ?? 0, // Right leg proprioception data (default to 0 if missing)
          });
        }

        console.log("Data Points for Chart:", selectedExerciseData);

        // Update the chart data with both left and right leg data for the selected cycle
        setChartData(selectedExerciseData); // Assuming setChartData takes an array of objects for plotting
      } else {
        console.log(`No data found for ${cycleSelectedItem}`);
      }
    } else if (
      exerciseName === "Dynamic Balance Test" ||
      exerciseName === "Static Balance Test" ||
      exerciseName === "Staircase Climbing Test"
    ) {
      // Extract the cycle number from the cycleSelectedItem, e.g., "cycle-1" -> 1
      const selectedCycleNumber = parseInt(cycleSelectedItem.split("-")[1], 10);
      console.log(selectedCycleNumber);

      // Access the cycle data using the dynamic key (`cycle-1`, `cycle-2`, etc.)
      const selectedCycleData = selectionData[selectedCycleNumber - 1]; // Access the cycle data for the selected cycle
      console.log(selectionData);

      if (selectedCycleData) {
        // Get the dynamic key (e.g., "cycle-wos", "cycle-ws")
        const cycleKey = Object.keys(selectedCycleData)[0]; // Since each cycle object has only one key

        // Get left leg and right leg data for the selected cycle (ensure both arrays exist and are non-empty)
        const leftLegData =
          Array.isArray(selectedCycleData[cycleKey]?.leftLegData) &&
          selectedCycleData[cycleKey]?.leftLegData.length > 0
            ? selectedCycleData[cycleKey].leftLegData[0] // Use only the first array if it exists
            : []; // Default to empty array if not available

        const rightLegData =
          Array.isArray(selectedCycleData[cycleKey]?.rightLegData) &&
          selectedCycleData[cycleKey]?.rightLegData.length > 0
            ? selectedCycleData[cycleKey].rightLegData[0] // Use only the first array if it exists
            : []; // Default to empty array if not available

        console.log(
          `Left Leg Data for Cycle ${selectedCycleNumber}:`,
          leftLegData
        );
        console.log(
          `Right Leg Data for Cycle ${selectedCycleNumber}:`,
          rightLegData
        );

        // Ensure both arrays have the same length for plotting
        const maxLength = Math.max(leftLegData.length, rightLegData.length);
        const selectedExerciseData = [];

        // Create data for both left leg and right leg
        for (let i = 0; i < maxLength; i++) {
          selectedExerciseData.push({
            name: `${i + 1}`, // Dynamic point names
            value1: leftLegData[i] ?? 0, // Left leg proprioception data (default to 0 if missing)
            value2: rightLegData[i] ?? 0, // Right leg proprioception data (default to 0 if missing)
          });
        }

        console.log("Data Points for Chart:", selectedExerciseData);

        // Update the chart data with both left and right leg data for the selected cycle
        setChartData(selectedExerciseData); // Assuming setChartData takes an array of objects for plotting
      } else {
        console.log(`No data found for ${cycleSelectedItem}`);
      }
    } else {
      const selectedExerciseData = Object.keys(selectionData).map(
        (cycleKey) => {
          const cycleData = selectionData[cycleKey]; // Dynamic cycle data
          const leftLegData = cycleData.leftLegData[0]; // Extract the first dataset for left leg
          const rightLegData = cycleData.rightLegData[0]; // Extract the first dataset for right leg
          console.log(`${cycleKey} Left Leg Data:`, leftLegData);
          console.log(`${cycleKey} Right Leg Data:`, rightLegData);
          // Map the data to create a single object with both left and right leg data
          return leftLegData.map((value, index) => ({
            name: `${cycleKey} Point ${index + 1}`, // Dynamic point names
            value1: value, // Left leg proprioception data
            value2: rightLegData?.[index] ?? 0, // Right leg proprioception data (default to 0 if missing)
          }));
        }
      );

      // Flatten the data to combine all cycles
      const allExerciseData = selectedExerciseData.flat();
      console.log("All Selected Exercise Data:", allExerciseData);

      // Update the chart data
      setChartData(allExerciseData);
    }
  };

  const handleDrawerItemSelect = (selection, exerciseName) => {
    setDrawerSelectedItem(selection); // Set the selected item

    // Fetch the data for the selected exercise dynamically
    const exerciseData = assessment.assessment.exercises[exerciseName];

    // Switch case based on the exercise name
    switch (exerciseName) {
      case "Extension Lag Test":
        switch (selection) {
          case "Active":
            // Handle selected exercise data for Active
            const leftLegActive = exerciseData?.["left-leg-active"]?.[0] ?? [];
            const rightLegActive =
              exerciseData?.["right-leg-active"]?.[0] ?? [];

            const activeData = leftLegActive.map((value, index) => ({
              name: `${index + 1}`,
              value1: value, // Left leg active data
              value2: rightLegActive[index] ?? 0, // Right leg active data (0 if no data available)
            }));
            setChartData(activeData);
            break;

          case "Passive":
            // Handle selected exercise data for Passive
            const leftLegPassive =
              exerciseData?.["left-leg-passive"]?.[0] ?? [];
            const rightLegPassive =
              exerciseData?.["right-leg-passive"]?.[0] ?? [];

            const passiveData = leftLegPassive.map((value, index) => ({
              name: `${index + 1}`,
              value1: value, // Left leg passive data
              value2: rightLegPassive[index] ?? 0, // Right leg passive data (0 if no data available)
            }));
            setChartData(passiveData);
            setSelectedExerciseData(passiveData); // Update state with passive data
            break;

          default:
            console.log("Invalid selection");
        }
        break;
      case "Dynamic Balance Test":
        const dynamicBalanceData = exerciseData;
        console.log("Dynamic Balance Data:", dynamicBalanceData);

        // Check if data exists
        if (!dynamicBalanceData) {
          console.log("No data found for Dynamic Balance Test.");
          return;
        }

        // Separate WS and WOS data
        const wsData = {};
        const wosData = {};

        // Iterate through the data and group by cycle identifier (e.g., wos-1, wos-2)
        for (const [key, value] of Object.entries(dynamicBalanceData)) {
          // Check if it's WS or WOS
          if (key.includes("ws")) {
            const cycle = key.split("-")[2]; // "ws-1" -> "1"

            if (!wsData[`cycle-${cycle}`]) {
              wsData[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              wsData[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              wsData[`cycle-${cycle}`].rightLegData = value;
            }
          } else if (key.includes("wos")) {
            const cycle = key.split("-")[2]; // "wos-1" -> "1"

            if (!wosData[`cycle-${cycle}`]) {
              wosData[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              wosData[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              wosData[`cycle-${cycle}`].rightLegData = value;
            }
          }
        }

        // Log the grouped data
        console.log("WS Data:", wsData);
        console.log("WOS Data:", wosData);

        // Count cycles for WS and WOS
        const wsCycleCount = Object.keys(wsData).length;
        const wosCycleCount = Object.keys(wosData).length;

        console.log("WS Cycle Count:", wsCycleCount);
        console.log("WOS Cycle Count:", wosCycleCount);

        // Handle the selection of data based on the user's choice
        switch (selection) {
          case "With Support":
            setSelectionData([]);
            console.log("With Support Data:", wsData);
            for (let i = 1; i <= wsCycleCount; i++) {
              // Pass WS data to handleCycleSelect, cycle index is `cycle-${i}`
              handleCycleSelect(
                "Dynamic Balance Test",
                "With Support",
                wsData,
                wsCycleCount
              );
            }
            break;

          case "Without Support":
            setSelectionData([]);
            console.log("Without Support Data:", wosData);
            for (let i = 1; i <= wosCycleCount; i++) {
              // Pass WOS data to handleCycleSelect, cycle index is `cycle-${i}`
              handleCycleSelect(
                "Dynamic Balance Test",
                "Without Support",
                wosData,
                wosCycleCount
              );
            }
            break;

          default:
            console.log(
              "Invalid selection. Please choose 'With Support' or 'Without Support'."
            );
            break;
        }
        break;
      case "Static Balance Test":
        const staticBalanceData = exerciseData;
        console.log("Static Balance Data:", staticBalanceData);

        // Check if data exists
        if (!staticBalanceData) {
          console.log("No data found for Static Balance Test.");
          return;
        }

        // Separate Eyes Open and Eyes Closed data
        const eyesOpenData = {};
        const eyesClosedData = {};

        // Iterate through the data and group by cycle identifier (e.g., eyes-open-1, eyes-closed-2)
        for (const [key, value] of Object.entries(staticBalanceData)) {
          // Check if it's Eyes Open or Eyes Closed
          if (key.includes("eyes-open")) {
            const cycle = key.split("-")[3]; // "eyes-open-1" -> "1"

            if (!eyesOpenData[`cycle-${cycle}`]) {
              eyesOpenData[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              eyesOpenData[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              eyesOpenData[`cycle-${cycle}`].rightLegData = value;
            }
          } else if (key.includes("eyes-closed")) {
            const cycle = key.split("-")[3]; // "eyes-closed-2" -> "2"

            if (!eyesClosedData[`cycle-${cycle}`]) {
              eyesClosedData[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              eyesClosedData[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              eyesClosedData[`cycle-${cycle}`].rightLegData = value;
            }
          }
        }

        // Log the grouped data
        console.log("Eyes Open Data:", eyesOpenData);
        console.log("Eyes Closed Data:", eyesClosedData);

        // Count cycles for Eyes Open and Eyes Closed
        const eyesOpenCycleCount = Object.keys(eyesOpenData).length;
        const eyesClosedCycleCount = Object.keys(eyesClosedData).length;

        console.log("Eyes Open Cycle Count:", eyesOpenCycleCount);
        console.log("Eyes Closed Cycle Count:", eyesClosedCycleCount);

        // Handle the selection of data based on the user's choice
        switch (selection) {
          case "Eyes Open":
            setSelectionData([]);
            console.log("Eyes Open Data:", eyesOpenData);
            for (let i = 1; i <= eyesOpenCycleCount; i++) {
              // Pass Eyes Open data to handleCycleSelect, cycle index is `cycle-${i}`
              handleCycleSelect(
                "Static Balance Test",
                "Eyes Open",
                eyesOpenData,
                eyesOpenCycleCount
              );
            }
            break;

          case "Eyes Closed":
            setSelectionData([]);
            console.log("Eyes Closed Data:", eyesClosedData);
            for (let i = 1; i <= eyesClosedCycleCount; i++) {
              // Pass Eyes Closed data to handleCycleSelect, cycle index is `cycle-${i}`
              handleCycleSelect(
                "Static Balance Test",
                "Eyes Closed",
                eyesClosedData,
                eyesClosedCycleCount
              );
            }
            break;
          default:
            console.log("Invalid selection");
            break;
        }
        break;
      case "Staircase Climbing Test":
        const staircaseClimbingData = exerciseData;
        console.log("Staircase Climbing Data:", staircaseClimbingData);

        // Check if data exists
        if (!staircaseClimbingData) {
          console.log("No data found for Staircase Climbing Test.");
          return;
        }

        // Separate WS and WOS data
        const wsDatas = {};
        const wosDatas = {};

        // Iterate through the data and group by cycle identifier (e.g., wos-1, wos-2)
        for (const [key, value] of Object.entries(staircaseClimbingData)) {
          // Check if it's WS or WOS
          if (key.includes("ws")) {
            const cycle = key.split("-")[2]; // "ws-1" -> "1"

            if (!wsDatas[`cycle-${cycle}`]) {
              wsDatas[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              wsDatas[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              wsDatas[`cycle-${cycle}`].rightLegData = value;
            }
          } else if (key.includes("wos")) {
            const cycle = key.split("-")[2]; // "wos-1" -> "1"

            if (!wosDatas[`cycle-${cycle}`]) {
              wosDatas[`cycle-${cycle}`] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            if (key.includes("left-leg")) {
              wosDatas[`cycle-${cycle}`].leftLegData = value;
            } else if (key.includes("right-leg")) {
              wosDatas[`cycle-${cycle}`].rightLegData = value;
            }
          }
        }

        // Log the grouped data
        console.log("WS Data:", wsDatas);
        console.log("WOS Data:", wosDatas);

        // Count cycles for WS and WOS
        const wscycleCount = Object.keys(wsDatas).length;
        const woscycleCount = Object.keys(wosDatas).length;

        console.log("WS Cycle Count:", wscycleCount);
        console.log("WOS Cycle Count:", woscycleCount);

        // Handle the selection of data based on the user's choice
        switch (selection) {
          case "With Support":
            setSelectionData([]);
            console.log("With Support Data:", wsDatas);
            for (let i = 1; i <= wscycleCount; i++) {
              // Pass WS data to handleCycleSelect, cycle index is cycle-${i}
              handleCycleSelect(
                "Staircase Climbing Test",
                "With Support",
                wsDatas,
                wscycleCount
              );
            }
            break;

          case "Without Support":
            setSelectionData([]);
            console.log("Without Support Data:", wosDatas);
            for (let i = 1; i <= woscycleCount; i++) {
              // Pass WOS data to handleCycleSelect, cycle index is cycle-${i}
              handleCycleSelect(
                "Staircase Climbing Test",
                "Without Support",
                wosDatas,
                woscycleCount
              );
            }
            break;
          default:
            break;
        }
        break;

      default:
        console.log("Exercise not found");
    }

    // Close the dropdown after selecting an item
    setIsDrawerOpen(false); // This will close the dropdown when an item is selected
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleSelectItem = (exerciseName) => {
    setSelectionData({});
    setSelectedItems(exerciseName);
    setIsOpen(false);

    // Initialize variable to hold selected exercise data
    let selectedExerciseData;

    // Check the selected type in assessment
    if (assessment.selected === "assessment") {
      switch (exerciseName) {
        case "Mobility Test":
          setDrawerItems([]);
          const exerciseData = assessment.assessment.exercises["Mobility Test"];
          setExerciseName(exerciseName);

          // Initialize an object to hold combined data for each cycle (left-leg and right-leg)
          const mobilityCycles = {};

          // Iterate through the data and group left and right leg data by their cycle number (1, 2, 3)
          for (const [key, value] of Object.entries(exerciseData)) {
            const cycle = key.split("-").pop(); // Extract cycle number by splitting on "-" and getting the last part (1, 2, 3)

            // Initialize cycle if not already present
            if (!mobilityCycles[cycle]) {
              mobilityCycles[cycle] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            // If it's left leg data, push to the left leg array
            if (key.includes("left-leg")) {
              mobilityCycles[cycle].leftLegData = value; // Store full left leg data
            }

            // If it's right leg data, push to the right leg array
            if (key.includes("right-leg")) {
              mobilityCycles[cycle].rightLegData = value; // Store full right leg data
            }
          }

          // Log the grouped mobility cycle data
          console.log("Mobility Cycles:", mobilityCycles);

          // Calculate the total cycle count (this is the total number of cycles)
          const cycleCount = Object.keys(mobilityCycles).length;
          console.log("Total Mobility Cycles Count:", cycleCount);

          // Iterate through each cycle and pass both left and right leg data together as a whole
          for (let i = 1; i <= cycleCount; i++) {
            const leftLegData = mobilityCycles[i]?.leftLegData ?? [];
            const rightLegData = mobilityCycles[i]?.rightLegData ?? [];

            // Combine the left and right leg data for the current cycle and pass as a whole
            if (leftLegData.length > 0 && rightLegData.length > 0) {
              handleCycleSelect(
                "Mobility Test",
                "",
                { leftLegData, rightLegData }, // Send both full arrays together
                cycleCount
              );
            }
          }
          break;

        case "Extension Lag Test":
          setDrawerItems([]); // Reset the drawer items before setting new data

          const extensionLagData =
            assessment.assessment.exercises["Extension Lag Test"];
          setExerciseName(exerciseName); // Set the exercise name

          // Initialize an object to hold combined data for each cycle (left-leg and right-leg)
          const extensionLagCycles = {};

          // Iterate through the data and group left and right leg data by their cycle number (1, 2, 3, etc.)
          for (const [key, value] of Object.entries(extensionLagData)) {
            const cycle = key.split("-").pop(); // Extract cycle number by splitting on "-" and getting the last part (e.g., 1, 2, 3)

            // Initialize cycle if not already present
            if (!extensionLagCycles[cycle]) {
              extensionLagCycles[cycle] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            // If it's left leg data, push the entire array to the left leg data
            if (key.includes("left-leg")) {
              extensionLagCycles[cycle].leftLegData.push(...value); // Store all elements of the array
            }

            // If it's right leg data, push the entire array to the right leg data
            if (key.includes("right-leg")) {
              extensionLagCycles[cycle].rightLegData.push(...value); // Store all elements of the array
            }
          }

          // Log the grouped extension lag cycle data
          console.log("Extension Lag Cycles:", extensionLagCycles);

          // Calculate the total cycle count (this is the total number of cycles)
          const cycleCounts = Object.keys(extensionLagCycles).length;
          console.log("Total Extension Lag Cycles Count:", cycleCounts);

          // Iterate through each cycle and pass both left and right leg data together as a whole
          for (let i = 1; i <= cycleCounts; i++) {
            const leftLegData = extensionLagCycles[i]?.leftLegData ?? [];
            const rightLegData = extensionLagCycles[i]?.rightLegData ?? [];

            // Combine the left and right leg data for the current cycle and pass as a whole
            if (leftLegData.length > 0 && rightLegData.length > 0) {
              handleCycleSelect(
                "Extension Lag Test",
                "",
                { leftLegData, rightLegData }, // Send the entire arrays for both left and right leg
                cycleCounts
              );
            }
          }
          break;

        case "Dynamic Balance Test":
          const dynamicBalanceData =
            assessment.assessment.exercises["Dynamic Balance Test"];
          setExerciseName(exerciseName);
          if (!dynamicBalanceData) {
            console.log("No data found for Dynamic Balance Test.");
            return;
          }

          // Aggregate WS and WOS data dynamically
          const withSupportData = {
            leftLegData: [],
            rightLegData: [],
          };

          const withoutSupportData = {
            leftLegData: [],
            rightLegData: [],
          };

          for (const [key, value] of Object.entries(dynamicBalanceData)) {
            if (key.startsWith("left-leg-ws")) {
              withSupportData.leftLegData.push(...value[0]); // Aggregate left-leg WS data
            } else if (key.startsWith("right-leg-ws")) {
              withSupportData.rightLegData.push(...value[0]); // Aggregate right-leg WS data
            } else if (key.startsWith("left-leg-wos")) {
              withoutSupportData.leftLegData.push(...value[0]); // Aggregate left-leg WOS data
            } else if (key.startsWith("right-leg-wos")) {
              withoutSupportData.rightLegData.push(...value[0]); // Aggregate right-leg WOS data
            }
          }

          // Set aggregated drawer items
          setDrawerItems({
            "With Support": withSupportData,
            "Without Support": withoutSupportData,
          });

          // Optional logging for debugging
          console.log("With Support Data:", withSupportData);
          console.log("Without Support Data:", withoutSupportData);

          setSelectedExerciseData(selectedExerciseData);
          break;

        case "Static Balance Test":
          const staticBalanceData =
            assessment.assessment.exercises["Static Balance Test"];
          setExerciseName(exerciseName);
          if (!staticBalanceData) {
            console.log("No data found for Static Balance Test.");
            return;
          }

          // Aggregate Eyes Open and Eyes Closed data dynamically
          const eyesOpenData = {
            leftLegData: [],
            rightLegData: [],
          };

          const eyesClosedData = {
            leftLegData: [],
            rightLegData: [],
          };

          for (const [key, value] of Object.entries(staticBalanceData)) {
            if (key.includes("left-leg-eyes-open")) {
              eyesOpenData.leftLegData.push(...value[0]); // Aggregate left-leg Eyes Open data
            } else if (key.includes("right-leg-eyes-open")) {
              eyesOpenData.rightLegData.push(...value[0]); // Aggregate right-leg Eyes Open data
            } else if (key.includes("left-leg-eyes-closed")) {
              eyesClosedData.leftLegData.push(...value[0]); // Aggregate left-leg Eyes Closed data
            } else if (key.includes("right-leg-eyes-closed")) {
              eyesClosedData.rightLegData.push(...value[0]); // Aggregate right-leg Eyes Closed data
            }
          }

          // Set aggregated drawer items
          setDrawerItems({
            "Eyes Open": eyesOpenData,
            "Eyes Closed": eyesClosedData,
          });

          // Optional logging for debugging
          console.log("Eyes Open Data:", eyesOpenData);
          console.log("Eyes Closed Data:", eyesClosedData);

          setSelectedExerciseData(selectedExerciseData);
          break;

        case "Staircase Climbing Test":
          const staircaseClimbingData =
            assessment.assessment.exercises["Staircase Climbing Test"];
          setExerciseName(exerciseName);
          if (!staircaseClimbingData) {
            console.log("No data found for Staircase Climbing Test.");
            return;
          }

          // Aggregate WS and WOS data dynamically
          const withSupport = {
            leftLegData: [],
            rightLegData: [],
          };

          const withoutSupport = {
            leftLegData: [],
            rightLegData: [],
          };

          for (const [key, value] of Object.entries(staircaseClimbingData)) {
            if (key.startsWith("left-leg-ws")) {
              withSupport.leftLegData.push(...value[0]); // Aggregate left-leg WS data
            } else if (key.startsWith("right-leg-ws")) {
              withSupport.rightLegData.push(...value[0]); // Aggregate right-leg WS data
            } else if (key.startsWith("left-leg-wos")) {
              withoutSupport.leftLegData.push(...value[0]); // Aggregate left-leg WOS data
            } else if (key.startsWith("right-leg-wos")) {
              withoutSupport.rightLegData.push(...value[0]); // Aggregate right-leg WOS data
            }
          }

          // Set aggregated drawer items
          setDrawerItems({
            "With Support": withSupport,
            "Without Support": withoutSupport,
          });

          // Optional logging for debugging
          console.log("With Support:", withSupport);
          console.log("Without Support:", withoutSupport);

          setSelectedExerciseData(selectedExerciseData);
          break;

        case "Proprioception Test":
          setDrawerItems([]);
          const proprioceptionData =
            assessment.assessment.exercises["Proprioception Test"];
          setExerciseName(exerciseName);

          // Initialize an object to hold combined data for each cycle (left-leg and right-leg)
          const proprioceptionCycles = {};

          // Iterate through the data and group left and right leg data by their cycle number (1, 2, etc.)
          for (const [key, value] of Object.entries(proprioceptionData)) {
            const cycle = key.split("-").pop(); // Extract cycle number by splitting on "-" and getting the last part (1, 2, 3)

            // Initialize cycle if not already present
            if (!proprioceptionCycles[cycle]) {
              proprioceptionCycles[cycle] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            // If it's left leg data, push all arrays to the left leg array
            if (key.includes("left-leg")) {
              proprioceptionCycles[cycle].leftLegData.push(...value); // Store all arrays for left leg
            }

            // If it's right leg data, push all arrays to the right leg array
            if (key.includes("right-leg")) {
              proprioceptionCycles[cycle].rightLegData.push(...value); // Store all arrays for right leg
            }
          }

          // Log the grouped proprioception cycle data
          console.log("Proprioception Cycles:", proprioceptionCycles);

          // Calculate the total cycle count (this is the total number of cycles)
          const cycleCount2 = Object.keys(proprioceptionCycles).length; // Changed variable name to cycleCount2
          console.log("Total Proprioception Cycles Count:", cycleCount2);

          // Iterate through each cycle and pass both left and right leg data together as a whole
          for (let i = 1; i <= cycleCount2; i++) {
            // Using cycleCount2 here
            const leftLegData = proprioceptionCycles[i]?.leftLegData ?? [];
            const rightLegData = proprioceptionCycles[i]?.rightLegData ?? [];

            // Combine the left and right leg data for the current cycle and pass as a whole
            if (leftLegData.length > 0 && rightLegData.length > 0) {
              handleCycleSelect(
                "Proprioception Test",
                "",
                { leftLegData, rightLegData }, // Send both full arrays together
                cycleCount2 // Passing cycleCount2 here
              );
            }
          }
          break;

        case "Walk and Gait Analysis":
          console.log(exerciseName);
          setExerciseName(exerciseName);
          const walkAndGaitData =
            assessment.assessment.exercises["Walk and Gait Analysis"];

          // Initialize an object to hold combined data for each cycle (left-leg and right-leg)
          const gaitCycles = {};

          // Iterate through the data and group left and right leg data by their cycle identifier
          for (const [key, value] of Object.entries(walkAndGaitData)) {
            const [leg, cycle] = key.split("-"); // Split "leftleg-1" -> ["leftleg", "1"]

            // Initialize cycle if not already present
            if (!gaitCycles[cycle]) {
              gaitCycles[cycle] = {
                leftLegData: [],
                rightLegData: [],
              };
            }

            // If it's left leg data, push to the left leg array
            if (leg === "leftleg") {
              gaitCycles[cycle].leftLegData = value; // Send full leftLeg data
            }

            // If it's right leg data, push to the right leg array
            if (leg === "rightleg") {
              gaitCycles[cycle].rightLegData = value; // Send full rightLeg data
            }
          }

          // Log the grouped gait cycle data
          console.log("Gait Cycles:", gaitCycles);

          // Calculate the total count (this is the total number of cycles)
          const totalCount = Object.keys(gaitCycles).length;
          console.log("Total Gait Cycles Count:", totalCount);

          // Iterate through each cycle and pass both left and right leg data together as a whole
          for (let i = 1; i <= totalCount; i++) {
            const leftLegData = gaitCycles[i]?.leftLegData ?? [];
            const rightLegData = gaitCycles[i]?.rightLegData ?? [];

            // Combine the left and right leg data for the current cycle and pass as a whole
            if (leftLegData.length > 0 && rightLegData.length > 0) {
              handleCycleSelect(
                "Walk and Gait Analysis",
                "",
                { leftLegData, rightLegData }, // Sending both full arrays together
                totalCount
              );
            }
          }
          break;

        default:
          setDrawerItems([]);
          console.log(`Exercise not found: ${exerciseName}`);
      }
    } else if (assessment.selected === "model_recovery") {
      // Access exercise data from model recovery
      console.log(assessment.assessment.Exercise);
      selectedExerciseData = assessment.assessment.Exercise[
        exerciseName
      ].values.map((value, index) => ({
        name: index, // Customize X-axis label if needed
        value1: value,
      }));
    }

    console.log(exerciseName, selectedExerciseData);
    setChartData(selectedExerciseData);
  };

  // Clamp the progress between 0 and 100
  const value = parseFloat(Math.min(Math.max(progress, 0), 100).toFixed(2));

  // Circle properties
  const radius = 50; // Radius of the circle
  const circumference = parseFloat((2 * Math.PI * radius).toFixed(2)); // Calculate circumference

  // Calculate the stroke offset
  const offset = parseFloat(
    (circumference - (value / 2 / 100) * circumference).toFixed(2)
  ); // Correctly calculate the offset
  var LegData;
  function processProprioceptionData(exercises) {
    // Check if "Proprioception Test" exists and contains the required properties
    if (
      exercises["Proprioception Test"] &&
      Array.isArray(exercises["Proprioception Test"].leftleg) &&
      Array.isArray(exercises["Proprioception Test"].rightleg)
    ) {
      // Extract Proprioception Test data
      const proprioceptionData = exercises["Proprioception Test"];

      // Map leftleg and rightleg values
      const leftleg = proprioceptionData.leftleg.map((arr) => arr[0]); // Extract first values
      const rightleg = proprioceptionData.rightleg.map((arr) => arr[0]); // Extract first values

      // Prepare data for left leg (for chart 1)
      const leftlegData = leftleg.map((value, index) => ({
        name: `Point ${index + 1}`,
        value, // Value for left leg
      }));

      // Prepare data for right leg (for chart 2)
      const rightlegData = rightleg.map((value, index) => ({
        name: `Point ${index + 1}`,
        value, // Value for right leg
      }));

      // Return separate data for left leg and right leg to be used individually in separate charts
      return { leftlegData, rightlegData };
    } else {
      // Return empty data if the exercise is not available
      return { leftlegData: [], rightlegData: [] };
    }
  }

  const data = [
    {
      name: "1",
      uv: 10,
      pv: 24,
      amt: 2400,
    },
    {
      name: "2",
      uv: 30,
      pv: 55,
      amt: 2210,
    },
    {
      name: "3",
      uv: 50,
      pv: 90,
      amt: 2290,
    },
    {
      name: "4",
      uv: 70,
      pv: 70,
      amt: 2000,
    },
    {
      name: "5",
      uv: 40,
      pv: 50,
      amt: 2181,
    },
    {
      name: "6",
      uv: 10,
      pv: 43,
      amt: 2500,
    },
    {
      name: "7",
      uv: 1,
      pv: 23,
      amt: 2100,
    },
  ];

  // Function to process overall reportData
  function processData(assessment) {
    // console.log(assessment)
    const exercises = assessment.assessment.exercises;

    // Process Proprioception Test Data
    const { leftlegData, rightlegData } = processProprioceptionData(exercises);

    // Return the processed data for both left leg and right leg separately
    return { leftlegData, rightlegData };
  }

  // Example usage
  if (assessment.selected === "assessment") {
    LegData = processData(assessment);
    console.log(chartData);
  } else {
  }
  useEffect(() => {
    if (assessment.selected === "model_recovery") {
      // Auto-select the first exercise when model_recovery is selected
      updateTableData(Object.keys(exercises)[0]); // Set the first exercise
    }
  }, [assessment.selected]);

  const [isDrawer, setIsDrawer] = useState(false);
  const [selectItems, setSelectItems] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 8,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // Assuming exercises is the object containing exercise details from the assessment.
  const exercises =
    assessment.selected === "assessment"
      ? assessment.assessment.exercises
      : assessment.reportData.Model_Recovery[0].Exercise;

  // Function to toggle the dropdown
  const drawerOpen = (state) => {
    setIsDrawer(state);
  };

  // Function to handle selecting an item from the dropdown
  const handleDrawerItem = (item) => {
    setSelectItems(item);
    setIsDrawer(false); // Close the drawer when an item is selected

    // Dynamically update rows and columns based on the selected exercise
    updateTableData(item);
  };

  // Function to update table data based on the selected exercise
  const updateTableData = (exerciseName) => {
    const selectedExerciseData = exercises[exerciseName];

    let formattedRows = [];
    let formattedColumns = [{ field: "id", headerName: "ID", width: 90 }];
    // Use switch-case to handle different exercises and set columns/rows accordingly
    if (assessment.selected === "model_recovery") {
      // Define the column structure for the table
      formattedColumns = [
        { field: "exerciseName", headerName: "Exercise Name", width: 150 },
        { field: "rom", headerName: "ROM", width: 150 },
        { field: "set", headerName: "Set", width: 100 },
        { field: "progress", headerName: "Progress", width: 150 },
        { field: "velocity", headerName: "Velocity", width: 150 },
        { field: "rep", headerName: "Rep", width: 150 },
      ];

      // Process the data for each exercise (e.g., Left-Knee-Bend, Right-Leg-Bend, etc.)
      formattedRows = Object.keys(assessment.assessment.Exercise).map(
        (exerciseName, index) => {
          const exerciseData = assessment.assessment.Exercise[exerciseName];

          // Extract values from each exercise's data
          const { rom, set, progress, velocity, rep } = exerciseData;

          // Initialize a row for each exercise
          const row = {
            id: index + 1, // Unique ID for each exercise
            exerciseName: exerciseName, // The name of the exercise
            rom: rom || null, // Range of motion (ROM)
            set: set || null, // Set value
            progress: progress || null, // Progress value
            velocity: velocity || 0, // Velocity value
            rep: rep || null, // Rep value
          };

          // Return the row data for each exercise
          return row;
        }
      );

      // Output the columns and rows for debugging or further processing
      console.log(formattedColumns);
      console.log(formattedRows);
    } else {
      switch (exerciseName) {
        case "Mobility Test":
          // Define column structure for the table
          formattedColumns.push({
            field: "leg",
            headerName: "Leg",
            width: 150,
          });
          formattedColumns.push({
            field: "cycles",
            headerName: "Cycles",
            width: 100,
          });
          formattedColumns.push({
            field: "minAngle",
            headerName: "Min Extension",
            width: 150,
          });
          formattedColumns.push({
            field: "maxAngle",
            headerName: "Max Flexion",
            width: 150,
          });
          formattedColumns.push({
            field: "velocity",
            headerName: "Velocity",
            width: 150,
          });
          formattedColumns.push({
            field: "pain",
            headerName: "Pain",
            width: 150,
          });

          // Initialize an array to hold the formatted rows
          formattedRows = [];

          // Iterate over each leg (left or right) in the selectedExerciseData
          Object.keys(selectedExerciseData).forEach((legKey) => {
            const legData = selectedExerciseData[legKey];
            console.log(`Processing data for ${legKey}:`, legData);

            // Extract the second array from each leg data (e.g., [Array(133), Array(4)])
            legData.forEach((dataArray, index) => {
              if (index === 1) {
                // Use the second array (index 1)
                console.log(
                  `Using second array data for ${legKey}:`,
                  dataArray
                );

                // Extract cycle number from the last part of the legKey (e.g., "left-leg-active-1" -> 1)
                const cycleNumber = legKey.split("-").pop(); // This gets the last part (e.g., "1" from "left-leg-active-1")

                // Assuming the data array contains values in the format: [minAngle, maxAngle, velocity, pain]
                const minAngle = dataArray[0] || null;
                const maxAngle = dataArray[1] || null;
                const velocity = dataArray[2] || null;
                const pain = dataArray[3] || null;

                // Only include rows where all required values are present (not empty or undefined)
                if (minAngle && maxAngle && velocity && pain) {
                  formattedRows.push({
                    id: `${legKey}-${index}`, // Unique ID for each row (legKey + index)
                    leg: legKey, // "leftleg" or "rightleg"
                    cycles: cycleNumber, // Cycle number extracted from the key
                    minAngle: minAngle, // Minimum angle
                    maxAngle: maxAngle, // Maximum angle
                    velocity: velocity, // Velocity
                    pain: pain, // Pain
                  });
                  console.log(`Added row for ${legKey} (Cycle ${cycleNumber})`);
                } else {
                  console.log(
                    `Skipping row for ${legKey} (Cycle ${cycleNumber}) due to missing data.`
                  );
                }
              }
            });
          });

          console.log("Formatted rows:", formattedRows);

          break;

        case "Dynamic Balance Test":
          // Define column structure for the table
          formattedColumns.push({
            field: "leg",
            headerName: "Leg",
            width: 150,
          });
          formattedColumns.push({
            field: "cycles",
            headerName: "Cycles",
            width: 100,
          });
          formattedColumns.push({
            field: "shiftToStand",
            headerName: "Sit to Stand",
            width: 150,
          });
          formattedColumns.push({
            field: "standToShift",
            headerName: "Stand to Sit",
            width: 150,
          });
          formattedColumns.push({
            field: "walkTime",
            headerName: "Walk Time",
            width: 150,
          });

          // Process the data for each leg (e.g., "left-leg-wos-1")
          formattedRows = Object.keys(selectedExerciseData)
            .map((key, index) => {
              const legData = selectedExerciseData[key];

              // Skip the first array (index 0) in the leg data and process the rest
              const filteredLegData = legData.slice(1); // Skip the first array (index 0)

              // Extract the necessary values for each row from the second array (and onwards)
              const legValues = filteredLegData
                .map((dataArray) => {
                  const shiftToStand =
                    dataArray[0] !== undefined ? dataArray[0] : "N/A"; // Allow 0 to be valid
                  const standToShift =
                    dataArray[1] !== undefined ? dataArray[1] : "N/A"; // Allow 0 to be valid
                  const walkTime =
                    dataArray[2] !== undefined ? dataArray[2] : "N/A"; // Allow 0 to be valid

                  // Only include rows where values are not "N/A"
                  if (
                    shiftToStand !== "N/A" ||
                    standToShift !== "N/A" ||
                    walkTime !== "N/A"
                  ) {
                    return {
                      shiftToStand: shiftToStand, // Shift to stand
                      standToShift: standToShift, // Stand to shift
                      walkTime: walkTime, // Walk time
                    };
                  }

                  // If all values are "N/A", skip this row
                  return null;
                })
                .filter((value) => value !== null); // Remove any rows with null values

              // Flatten and map the values into rows
              return legValues.map((value, i) => ({
                id: index * 100 + i, // Unique ID for each row
                leg: key, // "left-leg-wos-1"
                cycles: i + 1, // Cycle number (you can adjust this as needed)
                shiftToStand: value.shiftToStand,
                standToShift: value.standToShift,
                walkTime: value.walkTime,
              }));
            })
            .flat(); // Flattening the nested arrays into a single array of rows

          break;

        case "Static Balance Test":
          // Define column structure for the table
          formattedColumns.push({
            field: "leg",
            headerName: "Leg",
            width: 150,
          });
          formattedColumns.push({
            field: "cycles",
            headerName: "Cycle",
            width: 100,
          });
          formattedColumns.push({
            field: "balanceTime",
            headerName: "Balance Time",
            width: 150,
          });

          // Process the data for each leg (e.g., "left-leg-eyes-closed-1")
          formattedRows = Object.keys(selectedExerciseData)
            .map((key, index) => {
              const legData = selectedExerciseData[key];

              // Extract cycle number from the leg name (e.g., "left-leg-eyes-closed-1" => cycle 1)
              const cycleNumber = key.split("-").pop(); // Extracts '1' or '2' from keys like 'left-leg-eyes-closed-1'

              // Extract balance time from the second array (e.g., ['5'])
              const balanceTimeArray = legData[1]; // This is the second array (e.g., ['5'])
              const balanceTime =
                balanceTimeArray.length > 0 ? balanceTimeArray[0] : "N/A"; // Use the value from the second array

              // Initialize the cycle counter
              let cycleCounter = parseInt(cycleNumber); // Set cycle number based on leg name

              // Extract the necessary values for each row
              const legValues = [
                {
                  cycles: cycleCounter, // Set cycle number based on the leg name
                  balanceTime: balanceTime, // Balance time (from the second array)
                },
              ];

              // Flatten and map the values into rows
              return legValues.map((value, i) => ({
                id: index * 100 + i, // Unique ID for each row
                leg: key, // "left-leg-eyes-closed-1"
                cycles: value.cycles,
                balanceTime: value.balanceTime,
              }));
            })
            .flat(); // Flattening the nested arrays into a single array of rows

          break;

          case "Extension Lag Test":
            // Clear the formattedRows before processing the new data
            formattedRows = [];
          
            // Define column structure for the table
            formattedColumns.push({
              field: "leg",
              headerName: "Leg",
              width: 150,
            });
            formattedColumns.push({
              field: "cycles",
              headerName: "Cycles",
              width: 100,
            });
            formattedColumns.push({
              field: "activeED",
              headerName: "Active ED",
              width: 150,
            });
            formattedColumns.push({
              field: "passiveED",
              headerName: "Passive ED",
              width: 150,
            });
            formattedColumns.push({
              field: "totalED",
              headerName: "Total ED",
              width: 150,
            });
          
            // Initialize an array to hold the formatted rows
            Object.keys(selectedExerciseData).forEach((legKey) => {
              const legData = selectedExerciseData[legKey];
          
              // Extract the second array from each leg data (e.g., [Array(116), Array(3)])
              legData.forEach((dataArray, index) => {
                if (index === 1) { // Use the second array (index 1)
                  
                  const minAngle = (dataArray[0] !== undefined && dataArray[0] !== null) ? dataArray[0] : null;
                  const maxAngle = (dataArray[1] !== undefined && dataArray[1] !== null) ? dataArray[1] : null;
                  const velocity = (dataArray[2] !== undefined && dataArray[2] !== null) ? dataArray[2] : null;
          
                  // Only include rows where all required values are present (not empty or undefined)
                  if (minAngle !== null && maxAngle !== null && velocity !== null) {
                    formattedRows.push({
                      id: `${legKey}-${index + 1}`, // Create a unique ID combining legKey and index
                      leg: legKey, // "left-leg-1", "right-leg-1", etc.
                      cycles: legKey.split('-').pop(), // Cycle number extracted from the key
                      activeED: minAngle, // Active ED (min angle)
                      passiveED: maxAngle, // Passive ED (max angle)
                      totalED: velocity, // Total ED (velocity)
                    });
                  }
                }
              });
            });
          
            console.log("Formatted rows:", formattedRows);
          
            break;
          

        case "Walk and Gait Analysis":
          // Define column structure for the table
          formattedColumns.push({
            field: "leg",
            headerName: "Leg",
            width: 150,
          });
          formattedColumns.push({
            field: "cycle",
            headerName: "Cycle",
            width: 100,
          });
          formattedColumns.push({
            field: "distance",
            headerName: "Distance",
            width: 150,
          });
          formattedColumns.push({
            field: "standTime",
            headerName: "Stand Time",
            width: 150,
          });
          formattedColumns.push({
            field: "avgSwingTime",
            headerName: "Avg Swing Time",
            width: 150,
          });
          formattedColumns.push({
            field: "stancePhase",
            headerName: "Avg Stance Phase",
            width: 150,
          });
          formattedColumns.push({
            field: "strideLength",
            headerName: "Avg Stride Length",
            width: 150,
          });
          formattedColumns.push({
            field: "meanVelocity",
            headerName: "Mean Velocity",
            width: 150,
          });
          formattedColumns.push({
            field: "cadence",
            headerName: "Cadence",
            width: 150,
          });
          formattedColumns.push({
            field: "stepCount",
            headerName: "Step Count",
            width: 150,
          });
          formattedColumns.push({
            field: "activeTime",
            headerName: "Active Time",
            width: 150,
          });

          // Process the data for each leg (e.g., "leftleg-1", "rightleg-1")
          formattedRows = Object.keys(selectedExerciseData)
            .map((key, index) => {
              const legData = selectedExerciseData[key];

              // Extract cycle number from the leg name (e.g., "leftleg-1" => cycle 1)
              const cycleNumber = key.split("-").pop(); // Extracts '1' from keys like 'leftleg-1'

              // Extract the second array (e.g., [0, 0, 0, 0, 0, 0, 8, 8, 14])
              const gaitValues = legData[1]; // This is the second array

              // Initialize the cycle counter
              let cycleCounter = parseInt(cycleNumber); // Set cycle number based on leg name

              // Assign values to the corresponding fields
              const values = {
                distance: gaitValues[0] !== undefined ? gaitValues[0] : "0",
                standTime: gaitValues[1] !== undefined ? gaitValues[1] : "0",
                avgSwingTime: gaitValues[2] !== undefined ? gaitValues[2] : "0",
                stancePhase: gaitValues[3] !== undefined ? gaitValues[3] : "0",
                strideLength: gaitValues[4] !== undefined ? gaitValues[4] : "0",
                meanVelocity: gaitValues[5] !== undefined ? gaitValues[5] : "0",
                cadence: gaitValues[6] !== undefined ? gaitValues[6] : "0",
                stepCount: gaitValues[7] !== undefined ? gaitValues[7] : "0",
                activeTime: gaitValues[8] !== undefined ? gaitValues[8] : "0",
              };

              // Format the values into rows
              const legValues = [
                {
                  cycle: cycleCounter,
                  ...values,
                },
              ];

              return legValues.map((value, i) => ({
                id: index * 100 + i, // Unique ID for each row
                leg: key, // "leftleg-1"
                cycle: value.cycle,
                distance: value.distance,
                standTime: value.standTime,
                avgSwingTime: value.avgSwingTime,
                stancePhase: value.stancePhase,
                strideLength: value.strideLength,
                meanVelocity: value.meanVelocity,
                cadence: value.cadence,
                stepCount: value.stepCount,
                activeTime: value.activeTime,
              }));
            })
            .flat(); // Flattening the nested arrays into a single array of rows

          break;

          case "Proprioception Test":
            // Define column structure for the table
            formattedColumns = [
              { field: "leg", headerName: "Leg", width: 150 },
              { field: "cycles", headerName: "Cycles", width: 100 },
              { field: "selectedValue", headerName: "Selected Value", width: 150 },
            ];
          
            // Initialize formattedRows to an empty array
            formattedRows = [];
          
            // Process the data for each leg
            Object.keys(selectedExerciseData).forEach((legKey, legIndex) => {
              const legData = selectedExerciseData[legKey];
          
              // Process the second array for each leg
              legData.forEach((dataArray, dataIndex) => {
                if (Array.isArray(dataArray) && dataArray.length >= 2) {
                  // Extract the second item
                  const selectedValue = dataArray[1];
          
                  // Add the row only if the second item is valid
                  if (selectedValue !== undefined && selectedValue !== null) {
                    formattedRows.push({
                      id: `${legKey}-${legIndex}-${dataIndex}`, // Generate a unique ID
                      leg: legKey, // e.g., "left-leg-1", "right-leg-2"
                      cycles: `Cycle ${dataIndex + 1}`, // Label for the cycle
                      selectedValue: selectedValue, // The second item in the array
                    });
                  }
                }
              });
            });
          
            console.log("Formatted Rows:", formattedRows);
            break;
          
        case "Staircase Climbing Test":
          // Define column structure for the table
          formattedColumns.push({
            field: "leg",
            headerName: "Leg",
            width: 150,
          });
          formattedColumns.push({
            field: "cycleCount",
            headerName: "Cycles", // New column for cycle count after leg
            width: 100,
          });
          formattedColumns.push({
            field: "stepCount",
            headerName: "Step Count",
            width: 100,
          });
          formattedColumns.push({
            field: "ascentTime",
            headerName: "Ascent Time",
            width: 150,
          });
          formattedColumns.push({
            field: "descentTime",
            headerName: "Descent Time",
            width: 150,
          });
          formattedColumns.push({
            field: "turnTime",
            headerName: "Turn Time",
            width: 150,
          });

          // Process the data for each leg (e.g., "left-leg-wos-1", "right-leg-wos-1")
          formattedRows = Object.keys(selectedExerciseData)
            .map((key, index) => {
              const legData = selectedExerciseData[key];

              // Skip the first array (index 0) and process only the second array (index 1)
              const filteredLegData = legData.slice(1); // Skip the first array (index 0)

              // Extract the cycle count from the leg name (e.g., "left-leg-wos-1" → 1)
              const cycleCount = key.split("-").pop(); // Get the last part after the hyphen

              // Extract the necessary values for each row from the second array (and onwards)
              const legValues = filteredLegData
                .map((dataArray) => {
                  const stepCount =
                    dataArray[0] !== undefined ? dataArray[0] : "N/A"; // Allow 0 to be valid
                  const ascentTime =
                    dataArray[1] !== undefined ? dataArray[1] : "N/A"; // Allow 0 to be valid
                  const descentTime =
                    dataArray[2] !== undefined ? dataArray[2] : "N/A"; // Allow 0 to be valid
                  const turnTime =
                    dataArray[3] !== undefined ? dataArray[3] : "N/A"; // Allow 0 to be valid

                  // Only include rows where values are not "N/A"
                  if (
                    stepCount !== "N/A" ||
                    ascentTime !== "N/A" ||
                    descentTime !== "N/A" ||
                    turnTime !== "N/A"
                  ) {
                    return {
                      stepCount: stepCount, // Step count
                      ascentTime: ascentTime, // Ascent time
                      descentTime: descentTime, // Descent time
                      turnTime: turnTime, // Turn time
                    };
                  }

                  // If all values are "N/A", skip this row
                  return null;
                })
                .filter((value) => value !== null); // Remove any rows with null values

              // Flatten and map the values into rows
              return legValues.map((value, i) => ({
                id: index * 100 + i, // Unique ID for each row
                leg: key, // "left-leg-wos-1" or "right-leg-wos-1"
                cycleCount: cycleCount, // Cycle count extracted from the leg name
                stepCount: value.stepCount,
                ascentTime: value.ascentTime,
                descentTime: value.descentTime,
                turnTime: value.turnTime,
              }));
            })
            .flat(); // Flattening the nested arrays into a single array of rows

          break;

        // Add more cases for other exercises
        default:
          // Default case for exercises that don't match specific cases
          formattedColumns.push({
            field: "name",
            headerName: "Parameter",
            width: 200,
          });
          formattedColumns.push({
            field: "values",
            headerName: "Values",
            width: 150,
          });

          formattedRows = Object.keys(selectedExerciseData).map(
            (key, index) => ({
              id: index + 1,
              name: key, // Generic name
              values: selectedExerciseData[key].join(", "), // Joining values
            })
          );
          break;
      }
    }
    // Update the state with new rows and columns
    setRows(formattedRows);
    setColumns(formattedColumns);
  };

  // Function to handle row selection
  const handleRowSelection = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

  // Handle row click to perform actions like viewing details
  const handleRowClick = (row) => {
    // Implement logic when a row is clicked, such as opening a modal or showing details
    console.log("Row clicked: ", row);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex w-[95%] mx-auto mt-4">
        <div className="flex w-[60%] h-full">
          <div className="relative w-full">
            {/* Search Input */}
            <div className="w-full bg-gray-200 rounded-xl px-4 py-2 flex items-center">
              <input
                className="bg-transparent w-full outline-none text-gray-600 py-2"
                type="text"
                placeholder="Search Event"
                //value={searchQuery}
                //onChange={(e) => setSearchQuery(e.target.value)}
                //onFocus={() => setSearchQuery(searchQuery)} // Keep dropdown open on focus
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
                <p className="text-sm text-gray-700">Notification 1</p>
                <p className="text-sm text-gray-700 mt-2">Notification 2</p>
                <p className="text-sm text-gray-700 mt-2">Notification 3</p>
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
      <div className="w-full h-[100%] ">
        <div className="w-[95%] h-full mx-auto flex flex-col gap-6 pr-4 overflow-y-scroll scrollbar-custom3">
          <div className="w-full h-20 flex flex-row justify-between py-4">
            <div className="flex flex-row font-poppins font-semibold text-base text-[#475467] gap-2 items-center justify-center">
              <p>{assessment.reportData.user_id}</p>
              <p>|</p>
              <p>
                {" "}
                {assessment.selected == "assessment" ? (
                  <p>Assessment-{assessment.index + 1}</p>
                ) : (
                  <p>{assessment.assessment.Title}</p>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-poppins font-bold text-sm flex flex-row justify-between items-center gap-6">
                <p className="text-[#FF5647]">{Math.round(progress)}%</p>
                <p className="text-[#2B2D2E]">Completed Exercises</p>
                <p className="text-[#8FA7B8]">{remaining} left</p>
              </div>
              <div className="w-full bg-[#C7D3EB] h-2">
                <div
                  className="bg-[#FF5747] h-2"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[35%] flex flex-row gap-6">
            <div className="w-[40%] h-full flex flex-col gap-3 bg-white rounded-lg px-4 py-2">
              <p className="font-poppins font-bold text-base">PAIN SCORE</p>
              <div className="w-full flex flex-row">
                <div className="w-[50%] h-full ">
                  <div className="relative w-full h-[100%] mx-auto">
                    <svg
                      className="rotate-0"
                      width="100%"
                      height="100%"
                      viewBox="0 0 120 60"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Track */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="#FCE5E5" // light gray for track
                        strokeWidth="10"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(180, 60, 60)"
                      />

                      {/* Progress */}
                      {progress != 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="transparent"
                          stroke="#ff4d4f" // red for progress
                          strokeWidth="10"
                          strokeDasharray={`${circumference} ${circumference}`}
                          strokeDashoffset={offset}
                          style={{ transition: "stroke-dashoffset 0.35s" }}
                          transform="rotate(180, 60, 60)"
                        />
                      )}
                    </svg>

                    {/* Display the value inside the semicircle */}
                    <div className="absolute top-10  w-full h-full flex flex-col items-center justify-center text-[40px] font-poppins font-bold text-black">
                      {value}
                      <p className="text-base">Left</p>
                    </div>
                  </div>
                </div>
                <div className="w-[50%] h-full">
                  <div className="relative w-full h-[100%] mx-auto">
                    <svg
                      className="rotate-0"
                      width="100%"
                      height="100%"
                      viewBox="0 0 120 60"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background Track */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="#D8FAF6" // light gray for track
                        strokeWidth="10"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(180, 60, 60)"
                      />

                      {/* Progress */}
                      {progress != 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="transparent"
                          stroke="#38D9BC" // red for progress
                          strokeWidth="10"
                          strokeDasharray={`${circumference} ${circumference}`}
                          strokeDashoffset={offset}
                          style={{ transition: "stroke-dashoffset 0.35s" }}
                          transform="rotate(180, 60, 60)"
                        />
                      )}
                    </svg>

                    {/* Display the value inside the semicircle */}
                    <div className="absolute top-10  w-full h-full flex flex-col items-center justify-center text-[40px] font-poppins font-bold text-black">
                      {value}
                      <p className="text-base">Right</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%] flex flex-col gap-3 bg-white rounded-lg px-4 py-2">
              <p className="text-base font-poppins font-bold text-[#202224]">
                Left Flexion and Extension
              </p>
              <ResponsiveContainer width="100%" height="95%">
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
                    dataKey="uv" // For left leg
                    stroke="#8884d8"
                    strokeDasharray="12 7"
                    strokeWidth="2px"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[30%] flex flex-col gap-3 bg-white rounded-lg px-4 py-2">
              <p className="text-base font-poppins font-bold text-[#202224]">
                Right Flexion and Extension
              </p>
              <ResponsiveContainer width="100%" height="95%">
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
                    dataKey="pv" // For right leg
                    stroke="#82ca9d"
                    strokeDasharray="12 7"
                    strokeWidth="2px"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full h-[60%] flex flex-row">
            <div className="w-full h-full flex flex-col gap-1 bg-white rounded-lg px-4 py-4">
              <div className="w-full flex flex-row justify-between items-center">
                <p className="w-1/2 font-poppins font-medium text-lg">
                  Assessment-{assessment.index + 1}
                </p>

                {/* Conditionally render the dropdown */}
                {selectedItems !== "Mobility Test" &&
                  selectedItems !== "Extension Lag Test" &&
                  selectedItems !== "Proprioception Test" &&
                  selectedItems !== "Walk and Gait Analysis" && (
                    <div className="w-1/2 mx-auto my-auto relative">
                      {/* Drawer toggle */}
                      <div
                        className="flex flex-row gap-2 justify-end items-center pr-4 w-full"
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                      >
                        <div
                          className="w-1/2 flex justify-between items-center bg-white border-[#D5D5D5] border-[1px] rounded-lg px-4 py-2 cursor-pointer gap-2"
                          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        >
                          <p className="font-poppins font-medium text-black text-sm">
                            {drawerSelectedItem
                              ? `${drawerSelectedItem}`
                              : "Select Mode"}
                          </p>
                          <ChevronDownIcon
                            className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                              isDrawerOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Drawer content */}
                      {isDrawerOpen && (
                        <div
                          className={`absolute mt-2 right-4 bg-white p-4 rounded-lg shadow-lg w-[48%] transition-all duration-300 ease-in-out font-poppins z-50 ${
                            isDrawerOpen
                              ? "max-h-[300px] opacity-100"
                              : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
                          <ul>
                            {Object.keys(drawerItems).map((key, index) => (
                              <li
                                key={index}
                                className={`py-1 cursor-pointer ${
                                  drawerSelectedItem === key
                                    ? "font-medium"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleDrawerItemSelect(key, selectedItems)
                                }
                              >
                                {key}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                {/* Dropdown in the center, with a slight shift to the left */}
                <div className="w-1/2 mx-auto my-auto relative">
                  <div className="flex flex-row gap-2 justify-center items-center pr-4 w-full">
                    <div
                      className="w-1/2 flex justify-between items-center bg-white border-[#D5D5D5] border-[1px] rounded-lg px-4 py-2 cursor-pointer gap-2"
                      onClick={() => setIsCycleOpen(!isCycleOpen)} // Toggle dropdown visibility
                    >
                      <p className="font-poppins font-medium text-black text-sm">
                        {cycleSelectedItem
                          ? `${cycleSelectedItem}`
                          : "Select Cycle"}
                      </p>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                          isCycleOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isCycleOpen && (
                    <div
                      className={`absolute top-full mt-2 bg-white p-4 rounded-lg shadow-lg w-[50%] transition-all duration-300 ease-in-out font-poppins z-50 ${
                        isCycleOpen
                          ? "max-h-[300px] opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                      style={{
                        left: "50%",
                        transform: "translateX(-53%)", // Move it more to the left
                      }}
                    >
                      <ul>
                        {/* Dynamically generate the cycle options */}
                        {Object.keys(cycleOptions).map((cycleName, index) => (
                          <li
                            key={index}
                            className={`py-1 cursor-pointer ${
                              cycleSelectedItem === cycleName
                                ? "font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              // Store the selected cycle
                              setCycleSelectedItem(cycleName);
                              handleCycleData(
                                selectionData,
                                exerciseName,
                                cycleName
                              );
                              setIsCycleOpen(false);
                            }}
                          >
                            {cycleName}{" "}
                            {/* Display "Cycle 1", "Cycle 2", etc. */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Dropdown in the far right with a fixed parent size */}
                <div className="w-1/2 mx-auto my-auto relative">
                  <div className="flex flex-row gap-2 justify-end items-center pr-4 w-full">
                    <div
                      className="w-[48%] flex justify-between items-center bg-white border-[#D5D5D5] border-[1px] rounded-lg px-4 py-2 cursor-pointer gap-2"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <p className="font-poppins font-medium text-black text-sm">
                        {selectedItems ? `${selectedItems}` : "Select Exercise"}
                      </p>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      className={`absolute mt-2 right-4 bg-white p-4 rounded-lg shadow-lg w-[48%] transition-all duration-300 ease-in-out font-poppins z-50 ${
                        isOpen
                          ? "max-h-[300px] opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-auto`} // Adjust the height and allow overflow for the dropdown content
                    >
                      <ul>
                        {Object.entries(exercises).map(
                          ([exerciseName], index) => (
                            <li
                              key={index}
                              className={`py-1 cursor-pointer ${
                                selectedItems === exerciseName
                                  ? "font-medium"
                                  : ""
                              }`}
                              onClick={() => handleSelectItem(exerciseName)}
                            >
                              {exerciseName.charAt(0).toUpperCase() +
                                exerciseName.slice(1)}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={200}
                  height={300}
                  data={chartData} // Pass chartData for both leftleg and rightleg
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="1 0"
                    vertical={false}
                    stroke="rgba(0, 0, 0, 0.07)"
                  />
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
                    contentStyle={{ fontFamily: "Poppins", fontSize: 12 }}
                  />

                  {/* First Area for Left Leg */}
                  <Area
                    type="monotone"
                    dataKey="value1" // Left leg data
                    stackId="1"
                    stroke="#FF8F6D"
                    fill="#FF8F6D"
                  />

                  {/* Second Area for Right Leg */}
                  <Area
                    type="monotone"
                    dataKey="value2" // Right leg data
                    stackId="2"
                    stroke="#DBA5FF"
                    fill="#DBA5FF"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div></div>
          </div>
          <div className="w-full h-[5%]">
            <div className="w-full h-[720px] overflow-y-auto scrollbar-custom3 relative">
              <Paper sx={{ height: 600, width: "100%", padding: 4 }}>
                <div className="flex justify-between items-center">
                  <div>OVERVIEW</div>
                  {/* Conditional rendering based on assessment.selected */}
                  {assessment.selected !== "model_recovery" && (
                    <div
                      className="flex justify-between items-center bg-white border-[#D5D5D5] border-[1px] rounded-lg px-4 py-2 cursor-pointer gap-2"
                      onClick={() => drawerOpen(!isDrawer)}
                    >
                      <p className="font-poppins font-medium text-black text-sm">
                        {selectItems ? `${selectItems}` : "Select Exercise"}
                      </p>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                          isDrawer ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Dropdown Items */}
                {assessment.selected === "assessment" && isDrawer && (
                  <div
                    className={`absolute mt-2 right-4 bg-white p-4 rounded-lg shadow-lg w-[48%] transition-all duration-300 ease-in-out font-poppins z-50 ${
                      isDrawer
                        ? "max-h-[300px] opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <ul>
                      {Object.keys(exercises).map((exerciseKey) => (
                        <li
                          key={exerciseKey}
                          className="cursor-pointer py-2 px-4 hover:bg-gray-200"
                          onClick={() => handleDrawerItem(exerciseKey)} // Trigger handleSelectItem on click
                        >
                          {exerciseKey}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {assessment.selected === "model_recovery" && !isDrawer && (
                  <div
                    className={`absolute mt-2 right-4 bg-white p-4 rounded-lg shadow-lg w-[48%] transition-all duration-300 ease-in-out font-poppins z-50 ${
                      isDrawer
                        ? "max-h-[300px] opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <ul>
                      {/* Specific option for Model Recovery */}
                      <li
                        className="cursor-pointer py-2 px-4 hover:bg-gray-200"
                        onClick={() => handleDrawerItem("Model Recovery")}
                      >
                        Model Recovery Exercise
                      </li>
                    </ul>
                  </div>
                )}
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  onSelectionModelChange={(newSelection) =>
                    handleRowSelection(newSelection)
                  }
                  onRowClick={(e) => handleRowClick(e.row)} // handle row click here
                  sx={{ border: 0 }}
                />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailreport;
