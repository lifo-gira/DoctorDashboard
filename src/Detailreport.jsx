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

import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";

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
    console.log(assessment.assessment.Exercise);
    let totalExercises,definedExercisesCount; // Set total exercises to 8

    if(assessment.selected === "assessment"){
      totalExercises = 8;
      definedExercisesCount = Object.keys(exercises).length;
    }else{
      totalExercises = Object.keys(assessment.reportData.Exercise_Assigned).length;     
      definedExercisesCount = Object.keys(exercises).length;
    } 

    // Calculate the completion percentage based on defined exercises
    const progress = (definedExercisesCount / totalExercises) * 100;

    // Calculate remaining exercises as total minus defined
    const remaining = totalExercises - definedExercisesCount;

    return {
      progress,
      remaining,
    };
  };

  // Get the calculated progress and remaining values
  const { progress, remaining } = calculateProgress();

  const simpleData = useMemo(() => {
    const exercises =
      assessment.selected === "model_recovery"
        ? assessment.assessment.Exercise // Access the 'Exercise' object directly
        : assessment.assessment.exercises; // Fallback to 'exercises'

    return Object.entries(exercises).map(([exercise, data]) => ({
      exercise,
      cycles: isFirstRender ? "" : "", // Empty on first render
      minangle: isFirstRender ? "" : "", // Empty on first render
      maxangle: isFirstRender ? "" : "", // Empty on first render
      rom: isFirstRender ? "" : data.rom || "", // Use ROM value from the data
      painscore: isFirstRender ? "" : (data.pain && data.pain[0]) || "", // Use first pain score if available
      subRows:
        data.values.length > 0
          ? data.values.map((value, index) => ({
              exercise: "",
              cycles: (index + 1).toString(), // Incrementing cycle number
              minangle: "0", // You can change this logic if needed
              maxangle: "90", // You can change this logic if needed
              rom: data.rom, // Use ROM value from the data
              painscore: data.pain[index] || "N/A", // Use pain data if available
            }))
          : [], // If no values, return an empty array
    }));
  }, [assessment, isFirstRender]);

  const columns = useMemo(
    () => [
      { accessorKey: "exercise", header: "Exercise" },
      { accessorKey: "cycles", header: "Cycles" },
      { accessorKey: "minangle", header: "Min Angle" },
      { accessorKey: "maxangle", header: "Max Angle" },
      { accessorKey: "rom", header: "ROM" },
      { accessorKey: "painscore", header: "Pain Score" },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
  };

  const table = useMaterialReactTable({
    columns,
    data: simpleData, // Use the simplified data for testing
    enableExpandAll: false,
    enableExpanding: true,
    filterFromLeafRows: true,
    getSubRows: (row) => row.subRows ?? [], // Handle undefined subRows
    initialState: { expanded: false },
    paginateExpandedRows: false,
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontWeight: "bold",
        fontSize: "15px",
        fontFamily: "Poppins",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: "medium",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <p
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
        className="font-poppins font-bold text-[#7075DB] my-auto"
        style={{ letterSpacing: "4px" }}
      >
        OVERVIEW
      </p>
    ),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleSelectItem = (exerciseName) => {
    setSelectedItems(exerciseName);
    setIsOpen(false);

    // Initialize variable to hold selected exercise data
    let selectedExerciseData;

    // Check the selected type in assessment
    if (assessment.selected === "assessment") {
      selectedExerciseData = assessment.assessment.exercises[
        exerciseName
      ].values.map((value, index) => ({
        name: index, // Customize X-axis label
        value: value,
      }));
    } else if (assessment.selected === "model_recovery") {
      // Access exercise data from model recovery
      selectedExerciseData = assessment.assessment.Exercise[
        exerciseName
      ].values.map((value, index) => ({
        name: index, // Customize X-axis label if needed
        value: value,
      }));
    }

    console.log(selectedExerciseData);
    setChartData(selectedExerciseData);
  };

  // Clamp the progress between 0 and 100
  const value = Math.min(Math.max(progress, 0), 100);

  // Circle properties
  const radius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Calculate circumference

  // Calculate the stroke offset
  const offset = Math.round(circumference - (value / 2 / 100) * circumference); // Correctly calculate the offset
  console.log(
    "value",
    value,
    " ",
    "radius",
    radius,
    " ",
    "Circumference",
    circumference,
    " ",
    "Offset",
    offset
  );

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

  const exercises =
    assessment.selected === "assessment"
      ? assessment.assessment.exercises
      : assessment.reportData.Model_Recovery[0].Exercise;

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
                    dataKey="pv"
                    stroke="#4880FF"
                    strokeWidth="4px"
                    dot={false}
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
                    dataKey="pv"
                    stroke="#FF9D48"
                    strokeWidth="4px"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full h-[60%] flex flex-row">
            <div className="w-[69.25%] h-full flex flex-col gap-1 bg-white rounded-lg px-4 py-4">
              <div className="w-full flex flex-row justify-between items-center">
                <p className="w-1/2 font-poppins font-medium text-lg">
                  Assessment-{assessment.index + 1}
                </p>
                <div className="w-1/2 mx-auto my-auto relative">
                  <div className="flex flex-row gap-2 justify-end items-center pr-4 w-full">
                    <div
                      className="w-1/2 flex justify-between items-center bg-white border-[#D5D5D5] border-[1px] rounded-lg px-4 py-2 cursor-pointer gap-2"
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
                          ? "max-h-[200px] opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
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
                  data={chartData} // Use chartData state for the AreaChart
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
                  <Area
                    type="monotone"
                    dataKey="value"
                    stackId="1"
                    stroke="#FF8F6D"
                    fill="#FF8F6D"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div></div>
          </div>
          <div className="w-full h-[5%] ">
            <div className="w-full h-[720px] overflow-y-auto scrollbar-custom3">
              <MaterialReactTable table={table} className=" mrt-table" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailreport;
