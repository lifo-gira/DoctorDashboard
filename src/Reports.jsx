import React, { useState, useEffect } from "react";

import Porfileimg from "./Assets/profile.png";
import User from "./Assets/user.png";
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  DocumentCheckIcon,
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
  PieChart,
  Pie,
  Sector,
  Cell,
} from "recharts";

const data1 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const Reports = () => {
  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var userName = parsedData.user_id;
  const [isOpe, setIsOpe] = useState(false);

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
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
      <div className="w-full h-full">
        <div className="w-[95%] h-[85%] mx-auto">
          <div className="w-full h-[15%]  flex flex-row mt-6 justify-between items-center">
            <div className="w-[50%] h-full flex items-center">
              <div className="w-3/4 h-[70%] flex flex-row items-center gap-6 px-4 rounded-xl ml-4">
                <img
                  src={User}
                  alt="Profile"
                  className="w-16 h-16 rounded-xl "
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-row font-poppins font-semibold text-[#475467] text-lg gap-2">
                    <p>Patient Name </p>
                    <p>|</p>
                    <p>Raj Ronald Shaw</p>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row gap-4 justify-center items-center">
                      <div className="flex flex-row font-poppins font-semibold text-base text-[#475467] gap-[3px]">
                        <p>35</p>
                        <p>,</p>
                        <p>Male</p>
                      </div>
                      <div className="font-poppins font-normal text-sm text-[#6B6B6B]">
                        <p>PAR14AD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[50%] h-full  flex items-center justify-center">
              <div className="w-full mx-auto my-auto flex justify-end mr-12">
                <div
                  className="w-[37%] relative flex items-center font-poppins font-semibold text-white bg-[#282B30] rounded-full cursor-pointer p-0"
                  onClick={handleToggle}
                >
                  {/* Toggle Bubble */}
                  <div
                    className={`absolute w-[50%] h-[90%] bg-[#484E56] rounded-full transition-transform duration-300 ease-in-out ${
                      isToggled ? "translate-x-full" : "translate-x-0"
                    }`}
                  ></div>

                  {/* Text Labels */}
                  <div className="flex w-full justify-between py-2 px-4 z-10 gap-4">
                    <p
                      className={`text-sm ${
                        !isToggled ? "font-bold" : "font-normal opacity-75"
                      }`}
                    >
                      Assessment
                    </p>
                    <p
                      className={`text-sm ${
                        isToggled ? "font-bold" : "font-normal opacity-75"
                      }`}
                    >
                      Exercise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[45%] flex flex-col">
            <div className="w-full flex flex-row px-4 justify-between items-center">
              <p className="font-poppins font-semibold text-lg">
                Overall Progress
              </p>
              <div className="flex flex-row gap-6">
                <div className="flex flex-row items-center px-3 py-1 border-[#E5E5EF] border-[2px] rounded-lg gap-2">
                  <div className="w-[7px] h-[7px] rounded-full bg-blue-500" />
                  <p className="font-poppins font-normal text-xs text-[#1E1B39]">
                    Left Knee
                  </p>
                </div>
                <div className="flex flex-row items-center px-3 py-1 border-[#E5E5EF] border-[2px] rounded-lg gap-2">
                  <div className="w-[7px] h-[7px] rounded-full bg-purple-200" />
                  <p className="font-poppins font-normal text-xs text-[#1E1B39]">
                    Right Knee
                  </p>
                </div>
              </div>
              <div className="bg-[#1E1B39] py-2 px-3 rounded-[12px]">
                <p className="font-poppins font-medium text-sm text-white">
                  Assessment 1 - 3
                </p>
              </div>
            </div>
            <div className="w-full h-[100%]">
              <ResponsiveContainer width="100%" height="100%">
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
                    strokeDasharray="12 7"
                    strokeWidth="2px"
                  />
                  <Line
                    type="natural"
                    dataKey="uv"
                    stroke="#82ca9d"
                    strokeDasharray="12 7"
                    strokeWidth="2px"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full h-[40%] flex flex-row">
            <div className="w-[70%] h-full flex flex-col px-4 pt-2">
              <div className="flex flex-row gap-4">
                <p className="font-poppins font-semibold text-sm">
                  Deformity - Vagus
                </p>
                <DocumentCheckIcon className="w-5 h-5 cursor-pointer" />
              </div>
              <div>
                <div
                  className={`w-full rounded-lg flex flex-row justify-between items-center my-1 py-2 px-3 mt-2 cursor-pointer `} // Apply the background color conditionally
                >
                  <div className="w-3/6">
                    <div className="flex flex-row gap-4 py-0 px-2 items-center">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="20" cy="20" r="20" fill="#F6F6F6" />
                        <path
                          d="M31.1534 11.9982H29.6546C29.488 11.9982 29.3519 12.1342 29.3519 12.3009V13.3715H27.5516C27.385 13.3715 27.2489 13.5064 27.2489 13.6741V15.5157H24.7724V14.6857C24.7724 14.1878 24.3684 13.7838 23.8697 13.7838H23.2242C22.7265 13.7838 22.3235 14.1868 22.3225 14.6835C22.3215 14.1868 21.9174 13.7838 21.4207 13.7838H20.7752C20.2763 13.7838 19.8724 14.1868 19.8724 14.6857C19.8724 14.1868 19.4696 13.7838 18.9707 13.7838H18.3252C17.8275 13.7838 17.4233 14.1868 17.4233 14.6857C17.4233 14.1868 17.0194 13.7838 16.5217 13.7838H15.8761C15.3771 13.7838 14.9733 14.1868 14.9733 14.6857V15.5157H12.9557V13.6741C12.9557 13.5064 12.8206 13.3715 12.653 13.3715L10.8528 13.3713V12.3007C10.8528 12.134 10.7179 11.998 10.5503 11.998L9.05268 11.9982C8.8851 11.9982 8.75 12.1342 8.75 12.3009V20.8342C8.75 21.0008 8.8851 21.137 9.05268 21.137H10.5503C10.7179 21.137 10.8528 21.0009 10.8528 20.8342V19.7636H12.6532C12.8208 19.7636 12.9559 19.6287 12.9559 19.4609V17.6182H14.9735V18.0297C14.9735 18.0353 14.9742 18.0408 14.9745 18.0463V18.0296C14.9745 18.5274 15.3784 18.9314 15.8762 18.9314H16.5217C16.8349 18.9314 17.1101 18.7722 17.2727 18.5296C17.3443 18.422 17.5025 18.422 17.5743 18.5296C17.7367 18.7722 18.0121 18.9314 18.3253 18.9314H18.9708C19.0731 18.9314 19.1712 18.9145 19.262 18.8829C19.223 18.7478 19.2019 18.6045 19.2019 18.4568V17.9167C19.2019 17.7352 19.2335 17.5603 19.2914 17.3987C19.5045 16.806 20.0719 16.3821 20.7364 16.3821H23.8698C24.117 16.3821 24.3512 16.4408 24.559 16.5456C24.6909 16.6122 24.7724 16.7495 24.7724 16.8973V17.9167C24.7724 17.7237 24.7123 17.5454 24.6091 17.3987C24.4455 17.1667 24.1756 17.0149 23.8698 17.0149H21.5463V17.3138C21.5463 17.574 21.3353 17.7849 21.0752 17.7849H19.8442C19.8378 17.8281 19.8343 17.8722 19.8343 17.9169V18.4569C19.8343 18.7005 19.9314 18.921 20.0873 19.0824C20.2508 19.2533 20.4817 19.3588 20.736 19.3588H21.5196C21.523 19.3588 21.5262 19.3598 21.5295 19.3598C21.5356 19.3601 21.5411 19.361 21.5469 19.3615C21.7087 19.3755 21.8362 19.5098 21.8362 19.675C21.8362 19.828 21.7277 19.9556 21.5834 19.9851C21.37 20.0629 19.9435 20.6204 19.537 21.7539C19.4906 21.8832 19.3689 21.9635 19.2392 21.9635C19.2037 21.9635 19.1677 21.9575 19.1324 21.9449C18.968 21.886 18.8824 21.7049 18.9414 21.5403C19.2055 20.8037 19.7794 20.2775 20.3079 19.9283C20.0148 19.8426 19.7568 19.6739 19.5645 19.4463C19.3821 19.5222 19.1806 19.5645 18.9708 19.5645H18.3253C17.989 19.5645 17.6766 19.4559 17.4236 19.2712C17.1705 19.4559 16.8583 19.5645 16.5219 19.5645H15.8764C15.5389 19.5645 15.2277 19.4559 14.9748 19.2702C14.9758 19.7765 15.1509 20.2658 15.4693 20.6572L16.7096 22.178L16.3467 27.9988C16.3209 28.4132 16.6498 28.7636 17.0652 28.7636L22.6358 28.7632C23.0511 28.7632 23.3801 28.4128 23.3543 27.9985L22.9912 22.1738L22.9914 22.1736L24.258 20.6634C24.4562 20.4272 24.6009 20.154 24.6853 19.8618C24.7432 19.6645 24.7728 19.4579 24.7728 19.2489V18.0337C24.7728 18.0324 24.773 18.0312 24.773 18.0299V17.6184H27.2495V19.4611C27.2495 19.6288 27.3856 19.7637 27.5522 19.7637H29.3525V20.8343C29.3525 21.0009 29.4886 21.1372 29.6552 21.1372H31.1538C31.3206 21.1372 31.4557 21.0011 31.4557 20.8343L31.4554 12.301C31.4554 12.1343 31.3204 11.9983 31.1537 11.9983L31.1534 11.9982Z"
                          fill="#252727"
                        />
                      </svg>
                      <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between">
                          <p className="text-[#475467] font-poppins font-medium text-base">
                            Patient
                          </p>
                        </div>
                        <p className="text-start font-poppins font-medium text-sm text-[#475467]">
                          34,Male
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/6 text-sm font-normal font-poppins text-[#475467] text-center">
                    ID:
                  </div>

                  <div className="w-1/6">
                    <div className="bg-[#BAE5F6] text-[#0D3CB7] rounded-lg px-2 py-1 text-sm text-center">
                      <div>
                        <div>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/6 flex flex-row justify-end items-center">
                    <div className="flex flex-row gap-1 items-center">
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
              </div>
            </div>
            <div className="w-[30%] flex flex-col gap-2 h-full bg-white round-2xl py-2 mx-2">
              <p className="font-poppins font-medium text-base text-black px-4">
                Assessment 3
              </p>
              <p className="font-poppins font-medium text-xs text-[#4F4F4F] px-4">
                ROM - 25
              </p>
              <div className="w-full h-[2.5px] bg-[#7075DB]" />
              <ResponsiveContainer width="100%" height="80%">
                <PieChart width={350} height={350}>
                  <Pie
                    data={data1}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data1.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
