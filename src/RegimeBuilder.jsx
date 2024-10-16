import React, { useState, useEffect } from "react";
import "./Regimebuilder.css";
import Porfileimg from "./Assets/profile.png";
import User from "./Assets/user.png";
import Pushup from "./Assets/pushup.png";
import Crunch from "./Assets/crunch.png";
import Stretch from "./Assets/stretch.png";
import LeftLeg from "./Assets/leftdemo.mp4";
import RightLeg from "./Assets/rightdemo.mp4";
import LeftKnee from "./Assets/leftlegdemo.mp4";
import RightKnee from "./Assets/rightlegdemo.mp4";
import SitStand from "./Assets/sitstanddemo.mp4";
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

import {
  HomeIcon,
  CogIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

const RegimeBuilder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const exercises = ["Exercise 1", "Exercise 2", "Exercise 3"];
  const exercisecategory = [
    "Endurance",
    "Strength",
    "Balance",
    "Flexibility",
    "Stretching",
  ];
  const handleSelectItem = (exercise) => {
    setSelectedItems(exercise);
    setIsOpen(false); // Optionally close dropdown after selection
  };
  const handleSelectItems = (exercise) => {
    setSelectedItem(exercise);
    setIsOpens(false); // Optionally close dropdown after selection
    setSelectedCategory(exercise);
  };

  const exerciseslist = [
    {
      name: "Left Leg Bend",
      category: "Endurance",
      image: (
        <img
          src={Pushup}
          alt="Exercise demo"
          className="w-[90%] h-auto object-cover"
        />
      ),
      vid: LeftLeg,
    },
    {
      name: "Right Leg Bend",
      category: "Endurance",
      image: (
        <img
          src={Crunch}
          alt="Exercise demo"
          className="w-[90%] h-auto object-cover"
        />
      ),
      vid: RightLeg,
    },
    {
      name: "Left Knee Bend",
      category: "Strength",
      image: (
        <img
          src={Stretch}
          alt="Exercise demo"
          className="w-[90%] h-auto object-cover"
        />
      ),
      vid: LeftKnee,
    },
    {
      name: "Right Knee Bend",
      category: "Balance",
      image: (
        <img
          src={Pushup}
          alt="Exercise demo"
          className="w-[90%] h-auto object-cover"
        />
      ),
      vid: RightKnee,
    },
    {
      name: "Sit Stand",
      category: "Flexibility",
      image: (
        <img
          src={Crunch}
          alt="Exercise demo"
          className="w-[90%] h-auto object-cover"
        />
      ),
      vid: SitStand,
    },
    
  ];

  const [isOpe, setIsOpe] = useState(false);
  const items = [
    {
      name: "Endurance",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.3 5.2093C21.0426 5.2093 21.7548 4.93488 22.2799 4.44642C22.805 3.95795 23.1 3.29545 23.1 2.60465C23.1 1.91385 22.805 1.25135 22.2799 0.762885C21.7548 0.274418 21.0426 0 20.3 0C19.5574 0 18.8452 0.274418 18.3201 0.762885C17.795 1.25135 17.5 1.91385 17.5 2.60465C17.5 3.29545 17.795 3.95795 18.3201 4.44642C18.8452 4.93488 19.5574 5.2093 20.3 5.2093ZM15.26 23.3116L16.66 17.5814L19.6 20.186V28H22.4V18.2326L19.46 15.6279L20.3 11.7209C21.2592 12.7436 22.4426 13.5632 23.7708 14.1248C25.099 14.6864 26.5411 14.9769 28 14.9767V12.3721C25.536 12.4112 23.24 11.213 21.98 9.24651L20.58 7.16279C20.076 6.3814 19.18 5.86046 18.2 5.86046C17.78 5.86046 17.5 5.9907 17.08 5.9907L9.8 8.85581V14.9767H12.6V10.5488L15.12 9.63721L12.88 20.186L6.02 18.8837L5.46 21.4884L15.26 23.3116ZM2.8 9.76744C2.4287 9.76744 2.0726 9.63023 1.81005 9.386C1.5475 9.14177 1.4 8.81051 1.4 8.46512C1.4 8.11972 1.5475 7.78847 1.81005 7.54423C2.0726 7.3 2.4287 7.16279 2.8 7.16279H7V9.76744H2.8ZM4.2 4.55814C3.8287 4.55814 3.4726 4.42093 3.21005 4.1767C2.9475 3.93246 2.8 3.60121 2.8 3.25581C2.8 2.91042 2.9475 2.57916 3.21005 2.33493C3.4726 2.0907 3.8287 1.95349 4.2 1.95349H11.2V4.55814H4.2ZM1.4 14.9767C1.0287 14.9767 0.672601 14.8395 0.41005 14.5953C0.1475 14.3511 0 14.0198 0 13.6744C0 13.329 0.1475 12.9978 0.41005 12.7535C0.672601 12.5093 1.0287 12.3721 1.4 12.3721H7V14.9767H1.4Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "Strength",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1503 1.08196C10.1854 1.26158 6.78113 2.17543 5.63038 4.95762C4.97807 6.53751 3.30609 9.34724 2.30364 12.3038C1.71798 14.1368 1.28694 16.0218 1.01566 17.9364C0.976789 18.1926 1.01068 18.4554 1.11298 18.691C1.21528 18.9266 1.38132 19.1243 1.5898 19.2586C3.88121 20.6407 6.48088 21.3368 9.11341 21.2731C14.4777 21.2731 15.9238 20.0558 15.9238 20.0558C16.0173 20.6025 18.373 25 18.373 25C23.8769 21.8192 25.4862 15.1365 24.8794 11.0615C23.2 11.5833 21.941 13.5461 21.941 13.5461C21.941 13.5461 20.0284 11.881 18.3964 11.881C16.7644 11.881 12.9521 14.1426 12.9521 14.1426C12.7262 13.8741 12.4459 13.6638 12.1325 13.5275C11.8191 13.3912 11.4807 13.3326 11.1429 13.356C9.86787 13.356 7.67589 14.9372 7.67589 14.9372C7.31381 13.2593 7.1028 11.5484 7.04574 9.82776C7.1403 8.26376 7.63511 6.75721 8.4765 5.47158C8.4765 5.47158 10.5288 5.76986 11.0882 5.32211C11.3073 5.16872 11.5107 4.99118 11.6949 4.79242C11.6949 4.79242 13.2808 5.98488 13.4672 4.75964C13.5118 4.58978 13.5074 4.40957 13.4546 4.24241C13.4018 4.07524 13.3031 3.92884 13.1712 3.82219C13.1712 3.82219 13.8869 3.33446 13.0789 2.05874C12.2709 0.783024 11.7725 0.965925 11.1503 1.08196Z"
            fill="white"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Balance",
      icon: (
        <svg
          width="28"
          height="26"
          viewBox="0 0 32 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.71893 0.000194065C7.17836 0.00791147 5.87553 0.23333 4.39345 0.483795L4.90508 2.02917C7.86144 1.61713 7.84394 1.53427 8.06006 1.84872C10.2226 4.99455 12.0704 8.03303 13.0846 11.3217C15.2783 11.4908 17.8977 11.9629 19.6994 12.9951C21.9926 10.4456 25.733 9.07944 28.8162 7.9647C29.6342 7.66891 30.5149 8.48387 31.6738 8.67105L32 7.45984C31.6722 6.98171 30.129 6.29612 29.4877 6.28693C29.2162 6.28301 28.4451 6.50793 28.2114 6.59149C24.3775 7.36337 21.2564 7.51632 17.2979 8.8769C14.793 6.21692 12.1705 3.58598 9.16104 0.892677C8.53946 0.336322 8.50898 -0.0110313 7.71893 0.000194065ZM13.3621 12.6018C12.3606 14.4385 11.7249 14.882 10.3533 15.841C9.14805 15.5127 7.94554 15.178 6.53431 15.3509C5.12019 15.1541 4.54363 15.6999 2.82787 16.3261C2.30796 16.1437 1.68666 16.396 1.28719 16.5736C0.630693 16.9227 -0.148799 17.4353 0.024526 18.2987C0.290233 19.1905 1.38522 18.9229 1.88528 18.6988C2.30547 18.4897 2.6964 18.083 2.98586 17.7629C4.4244 17.8028 5.0632 17.7539 6.55114 17.0674C7.67768 17.5446 9.10237 17.7343 10.3793 17.7671C10.458 17.706 10.539 17.648 10.622 17.5934C11.3605 17.1093 12.2561 16.9243 13.0653 17.2587C13.8744 17.5932 14.3938 18.3632 14.5976 19.2369C14.7179 19.7527 14.7376 20.3142 14.6552 20.8883C14.9748 21.8234 15.2177 22.6824 15.7927 23.8288C15.4433 25.427 15.5542 27.0058 15.6405 28.6236L14.1077 29.2234L13.8157 30H18.5399L17.9924 29.1649L16.891 28.5856C17.1268 26.9715 17.5388 25.3759 17.3113 23.7134C17.3483 22.4713 16.9554 21.2293 16.7227 19.9872C18.1561 18.1463 17.4207 16.8483 18.425 14.8455C18.5701 14.5567 18.7323 14.2774 18.9105 14.0094C17.0694 13.2138 15.2445 12.6877 13.3621 12.6018ZM12.1409 18.3437C11.8681 18.3521 11.5729 18.4531 11.2667 18.6538C10.777 18.9748 10.299 19.5522 10.0045 20.2999C9.71001 21.0477 9.66312 21.8034 9.79829 22.3827C9.93347 22.9621 10.2215 23.3378 10.6082 23.4976C10.9949 23.6574 11.4568 23.5918 11.9465 23.2708C12.4363 22.9498 12.9144 22.3723 13.2089 21.6246C13.5034 20.8768 13.5501 20.1212 13.415 19.5419C13.2798 18.9625 12.9918 18.5867 12.6052 18.4269C12.4602 18.3669 12.3046 18.3386 12.1409 18.3437H12.1409Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "Flexibility",
      icon: (
        <svg
          width="28"
          height="32"
          viewBox="0 0 25 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8286 13.15L11.5143 17.2L12.8286 21.25M12.8286 13.15L9.54286 11.125L8.88571 17.2M12.8286 13.15L17.4286 15.85V23.275M12.8286 21.25H10.8571L8.88571 17.2M12.8286 21.25L17.4286 23.275M8.88571 17.2V6.4L14.1429 1M8.88571 17.2L10.2 21.25M10.2 21.25H4.94286L1 28M10.2 21.25L11.5143 12.475L10.2 16.525V21.25ZM24 28L17.4286 23.275M15.4571 9.775C15.1086 9.775 14.7743 9.63277 14.5278 9.37959C14.2813 9.12642 14.1429 8.78304 14.1429 8.425C14.1429 8.06696 14.2813 7.72358 14.5278 7.47041C14.7743 7.21723 15.1086 7.075 15.4571 7.075C15.8057 7.075 16.14 7.21723 16.3865 7.47041C16.633 7.72358 16.7714 8.06696 16.7714 8.425C16.7714 8.78304 16.633 9.12642 16.3865 9.37959C16.14 9.63277 15.8057 9.775 15.4571 9.775Z"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Stretching",
      icon: (
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 0.333984C12.2833 0.333984 13.3333 1.38398 13.3333 2.66732C13.3333 3.95065 12.2833 5.00065 11 5.00065C9.71667 5.00065 8.66667 3.95065 8.66667 2.66732C8.66667 1.38398 9.71667 0.333984 11 0.333984ZM21.5 8.50065H14.5V23.6673H12.1667V16.6673H9.83333V23.6673H7.5V8.50065H0.5V6.16732H21.5V8.50065Z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredExercises =
    selectedCategory === "All"
      ? exerciseslist
      : exerciseslist.filter(
          (exercise) => exercise.category === selectedCategory
        );

  const toggleSlideBar = () => {
    setIsOpe(!isOpe);
  };

  const [selectedExercises, setSelectedExercises] = useState([]);
  const [addedCategories, setAddedCategories] = useState(new Set());
  const [exerciseInputs, setExerciseInputs] = useState({});
  const [addedExercisesByCategory, setAddedExercisesByCategory] = useState([]);

  const handleInputChange = (exerciseName, field, value) => {
    setExerciseInputs((prev) => ({
      ...prev,
      [exerciseName]: {
        ...(prev[exerciseName] || { reps: 0, sets: 0 }),
        [field]: value,
      },
    }));
  };

  const handleAddExercise = (
    exerciseName,
    exerciseCategory,
    exerciseImage,
    vid
  ) => {
    const { reps, sets } = exerciseInputs[exerciseName] || { reps: 0, sets: 0 };

    // Check if the exercise already exists in selectedExercises
    const exerciseExists = selectedExercises.some(
      (exercise) =>
        exercise.name === exerciseName && exercise.category === exerciseCategory
    );

    if (exerciseExists) {
      // Display a warning message (you can customize this part)
      alert(
        `Exercise "${exerciseName}" in category "${exerciseCategory}" has already been added.`
      );
      return; // Exit the function if the exercise already exists
    }

    const newExercise = {
      name: exerciseName,
      category: exerciseCategory,
      reps: parseInt(reps),
      sets: parseInt(sets),
      image: exerciseImage,
      vid: vid,
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setAddedCategories((prev) => new Set(prev).add(exerciseCategory));
    setAddedExercisesByCategory((prev) => ({
      ...prev,
      [exerciseCategory]: [
        ...(prev[exerciseCategory] || []),
        { name: exerciseName, image: exerciseImage },
      ],
    }));

    // Optionally, reset inputs after adding
    handleInputChange(exerciseName, "reps", 0);
    handleInputChange(exerciseName, "sets", 0);
  };

  const [clickedCategory, setClickedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    // Toggle the clicked category
    setClickedCategory((prevCategory) =>
      prevCategory === categoryName ? null : categoryName
    );
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpens, setIsPopupOpens] = useState(false);
  const [vidname, setvidname] = useState(null);
  const togglepopups = (vid) => {
    setvidname(vid);
    setIsPopupOpens((prev) => !prev);
  };

  const togglePopup = () => {
    if (selectedExercises.length > 0) {
      setIsPopupOpen((prev) => !prev);
      if (!isPopupOpen) {
        setIsOpe(false);
      }
    } else {
      alert(`No Exercise Added`);
      return;
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteExercise = (exerciseName, exerciseCategory) => {
    // Update selectedExercises state
    setSelectedExercises((prev) =>
      prev.filter((exercise) => exercise.name !== exerciseName)
    );

    // Update addedExercisesByCategory state
    setAddedExercisesByCategory((prev) => {
      const updatedCategoryExercises =
        prev[exerciseCategory]?.filter(
          (exercise) => exercise.name !== exerciseName
        ) || [];

      return {
        ...prev,
        [exerciseCategory]: updatedCategoryExercises,
      };
    });
    if (selectedExercises.length == 0) {
      closePopup();
    }
  };

  const postExercise = () => {
    console.log("Exercise Data", selectedExercises);
    setSelectedExercises([]);
    setAddedExercisesByCategory([]);
    togglePopup();
  };
  const handleInputChanges = (exerciseName, field, value) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        // Check if the current exercise matches the one being updated
        if (exercise.name === exerciseName) {
          // Update the specific field (reps or sets)
          return {
            ...exercise,
            [field]: value, // This will update either 'reps' or 'sets'
          };
        }
        return exercise; // Return the exercise unchanged
      })
    );
  };

  const handleVideoEnd = () => {
    setIsPopupOpens(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex w-[95%] mx-auto mt-4">
        <div className="flex w-[60%]  h-full">
          <div className="w-5/6  px-4 py-2 flex items-center">
            <p className="text-[#475467] text-xl font-poppins font-semibold">
              REGIME BUILDER
            </p>
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
                Dr. Sharon
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <div className="w-[95%] h-[85%]  mx-auto">
          <div className="w-full h-[20%]  flex flex-row">
            <div className="w-[50%] h-full flex items-center">
              <div
                className="w-3/4 h-[70%] flex flex-row items-center gap-6 px-4 rounded-xl ml-4"
                style={{
                  background:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 20%, rgba(173, 216, 230, 0.6) 95%)",
                }}
              >
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
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-row font-poppins font-semibold text-base text-[#475467] gap-[3px]">
                        <p>35</p>
                        <p>,</p>
                        <p>Male</p>
                      </div>
                      <div className="font-poppins font-normal text-base text-[#6B6B6B]">
                        <p>PAR14AD</p>
                      </div>
                    </div>
                    <div
                      className={`flex flex-row gap-1 items-center justify-end  `}
                    >
                      <div
                        className={`text-xs font-poppins font-medium border-b-2 text-[#476367] border-blue-gray-500 cursor-pointer`}
                        //onClick={() => onReportClick(item.patient_id)}
                      >
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
            <div className="w-[50%] h-[85%]  flex items-center">
              <div className="w-full mx-auto mt-4 relative">
                <div className="flex flex-row gap-2">
                  <div
                    className="flex justify-between items-center bg-[#E0E0FF] rounded-lg px-4 py-2 cursor-pointer gap-4 w-[40%]"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <p className="font-poppins font-medium text-black text-sm">
                      {selectedItems
                        ? `${selectedItems}`
                        : "Previous Exercises Assigned"}
                    </p>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="ml-4">
                    <svg
                      width="40"
                      height="40"
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
                  </div>
                </div>
                {isOpen && (
                  <div
                    className={`absolute mt-2 bg-white p-4 rounded-lg shadow-lg w-[40%] transition-all duration-300 ease-in-out font-poppins ${
                      isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <ul>
                      {exercises.map((exercise, index) => (
                        <li
                          key={index}
                          className={`py-1 cursor-pointer ${
                            selectedItems === exercise ? "font-medium" : ""
                          }`}
                          onClick={() => handleSelectItem(exercise)}
                        >
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-[80%] ">
            <div className="w-[50%] ml-5 mt-4 relative">
              <div className="flex flex-row gap-2">
                <div
                  className="flex justify-between items-center bg-[#E0E0FF] rounded-lg px-4 py-2 cursor-pointer gap-4 w-[40%] font-poppins"
                  onClick={() => setIsOpens(!isOpens)}
                >
                  <p className="font-poppins font-medium text-black text-sm">
                    {selectedItem ? `${selectedItem}` : "Exercise Category"}
                  </p>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-[#9CA3AF] transition-transform duration-300 ${
                      isOpens ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {isOpens && (
                <div
                  className={`absolute mt-2 bg-white p-4 rounded-lg shadow-lg w-[40%] transition-all duration-300 ease-in-out font-poppins ${
                    isOpens ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <ul>
                    {exercisecategory.map((exercise, index) => (
                      <li
                        key={index}
                        className={`py-1 cursor-pointer ${
                          selectedItem === exercise ? "font-medium" : ""
                        }`}
                        onClick={() => handleSelectItems(exercise)}
                      >
                        {exercise}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-6 ml-5 w-[95%] h-[85%] overflow-hidden overflow-y-auto scrollbar-custom">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-3 flex items-center space-x-4 w-96 h-[180px] min-h-[180px]"
                  >
                    <div className="flex flex-col justify-between w-full">
                      <div className="text-lg text-[#475467] font-semibold font-poppins flex flex-row justify-between items-center w-full">
                        <p>{exercise.name}</p>
                        <div className="flex flex-row gap-4">
                          <button
                            onClick={() =>
                              handleAddExercise(
                                exercise.name,
                                exercise.category,
                                exercise.image,
                                exercise.vid
                              )
                            }
                          >
                            <PlusIcon className="w-5 h-5 text-green-400" />
                          </button>
                          <button onClick={() => togglepopups(exercise.vid)}>
                            <svg
                              width="22"
                              height="21"
                              viewBox="0 0 22 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.83203 1.75H20.1654V3.5H19.2487V15.75H13.2115L16.8782 19.25L15.582 20.4872L10.9987 16.1122L6.41536 20.4872L5.1192 19.25L8.78586 15.75H2.7487V3.5H1.83203V1.75ZM4.58203 3.5V14H17.4154V3.5H4.58203ZM9.16536 5.6875L13.4434 8.75L9.16536 11.8125V5.6875Z"
                                fill="#475467"
                                fill-opacity="0.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-4  font-poppins items-end justify-between w-full">
                        <div className="flex flex-row gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-[#475467]">
                              REP
                            </span>
                            <div className="flex flex-row justify-between">
                              <input
                                type="number"
                                value={exerciseInputs[exercise.name]?.reps || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    exercise.name,
                                    "reps",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="bg-[#FFA7EC] text-[#475467] rounded-lg px-2 py-1 text-sm font-semibold w-14"
                                min="0"
                                placeholder="00"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-[#475467]">
                              SET
                            </span>
                            <div className="flex flex-row ">
                              <input
                                type="number"
                                value={exerciseInputs[exercise.name]?.sets || 0}
                                onChange={(e) =>
                                  handleInputChange(
                                    exercise.name,
                                    "sets",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="bg-blue-200 text-[#475467] rounded-lg px-2 py-1 text-sm font-semibold w-14"
                                min="0"
                                placeholder="00"
                              />
                            </div>
                          </div>
                        </div>

                        <div className=" flex justify-end">
                          {exercise.image}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-lg text-gray-500 font-semibold w-full font-poppins">
                  No exercises found in this category.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 h-2/3 flex items-center z-50">
          {/* Slidebar container */}
          <div
            className={`bg-[#475467] h-full transition-width duration-500 flex items-center mr-2 relative ${
              isOpe ? "w-64" : "w-20"
            } rounded-l-xl`}
          >
            {/* Chevron Button/Icon */}
            <div
              className={`absolute -left-[20px] top-1/2 transform -translate-y-1/2 bg-[#475467] cursor-pointer rounded-full border-2 border-[#475467] p-1 z-0`}
              onClick={toggleSlideBar}
            >
              <ChevronLeftIcon
                className={`h-8 w-8 text-white transform transition-transform duration-300 ${
                  isOpe ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Slidebar Items */}
            <div
              className={`w-full h-[90%] flex flex-col  items-center overflow-y-auto scrollbar-custom3 gap-6 ${
                isOpe ? "" : "justify-center"
              }`}
            >
              <ul
                className={`mx-auto flex flex-col gap-6 items-center  ${
                  isOpe ? "justify-center w-full" : "justify-center w-[80%]"
                }`}
              >
                {items.map((item, index) => (
                  <li key={index} className="w-[60%]">
                    <div
                      className={`flex items-center w-full mx-auto hover:bg-[#374151] rounded-md p-2 justify-center transition-colors duration-200 cursor-pointer ${
                        addedExercisesByCategory[item.name]?.length > 0
                          ? "bg-green-500"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(item.name)}
                    >
                      <div
                        className={
                          "w-full h-full flex flex-row  gap-0 justify-center"
                        }
                      >
                        <div className="text-white">{item.icon}</div>
                        {isOpe && (
                          <span className="text-white ml-4 font-poppins text-md">
                            {item.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Horizontal Scroll of Added Exercises */}
                    {isOpe &&
                      clickedCategory === item.name &&
                      addedExercisesByCategory[item.name] && (
                        <div className="mt-3 overflow-x-auto scrollbar-custom1">
                          <div className="flex flex-row gap-4">
                            {addedExercisesByCategory[item.name].map(
                              (exercise, exIndex) => (
                                <div
                                  key={exIndex}
                                  className="w-[70%] flex-shrink-0 mb-2"
                                >
                                  <div className="bg-white h-[100%] p-2 rounded-xl flex flex-col items-center justify-center gap-2">
                                    {exercise.image}
                                    <p className="font-poppins font-medium text-sm w-full text-center">
                                      {exercise.name}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
              <div
                className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                onClick={togglePopup}
              >
                <EyeIcon className="w-6 h-6" color="white" />
                <p className="font-poppins text-sm text-white font-semibold">
                  View All
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="h-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg max-h-[80vh]  overflow-y-auto scrollbar-custom2 popup">
            {" "}
            {/* Set max height and enable scrolling */}
            <div className={`w-full flex flex-row  ${selectedExercises.length > 0? "justify-between" :"justify-end"}`}>
              {selectedExercises.length > 0 && <h2 className="text-lg font-bold">Selected Exercises</h2>}
              <XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={closePopup}
              />
            </div>
            <div className={`mt-4 grid grid-cols-3 gap-6`}>
              {selectedExercises.length > 0 ? (
                selectedExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-3 flex items-center space-x-4 w-96 h-[180px] min-h-[180px]"
                  >
                    <div className="flex flex-col justify-between w-full">
                      <div className="text-lg text-[#475467] font-semibold font-poppins flex flex-row justify-between items-center w-full">
                        <p>{exercise.name}</p>
                        <div className="flex flex-row gap-4">
                          <button
                            onClick={() =>
                              handleDeleteExercise(
                                exercise.name,
                                exercise.category
                              )
                            }
                          >
                            <TrashIcon className="w-5 h-5 text-red-400" />
                          </button>
                          <button onClick={() => togglepopups(exercise.vid)}>
                            <svg
                              width="22"
                              height="21"
                              viewBox="0 0 22 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.83203 1.75H20.1654V3.5H19.2487V15.75H13.2115L16.8782 19.25L15.582 20.4872L10.9987 16.1122L6.41536 20.4872L5.1192 19.25L8.78586 15.75H2.7487V3.5H1.83203V1.75ZM4.58203 3.5V14H17.4154V3.5H4.58203ZM9.16536 5.6875L13.4434 8.75L9.16536 11.8125V5.6875Z"
                                fill="#475467"
                                fillOpacity="0.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-4 font-poppins items-end justify-between w-full">
                        <div className="flex flex-row gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-[#475467]">
                              REP
                            </span>
                            <div className="flex flex-row justify-between">
                              <input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) =>
                                  handleInputChange(
                                    exercise.name,
                                    "reps",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="bg-[#FFA7EC] text-[#475467] rounded-lg px-2 py-1 text-sm font-semibold w-14"
                                min="0"
                                placeholder="00"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-[#475467]">
                              SET
                            </span>
                            <div className="flex flex-row">
                              <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  handleInputChange(
                                    exercise.name,
                                    "sets",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="bg-blue-200 text-[#475467] rounded-lg px-2 py-1 text-sm font-semibold w-14"
                                min="0"
                                placeholder="00"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">{exercise.image}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-poppins font-semibold text-lg flex justify-center items-center w-full">No exercises added.</p>
              )}
            </div>
            <div className="w-full flex justify-end pr-5">
              {selectedExercises.length > 0 && (
                <button
                  onClick={postExercise}
                  className="mt-4 bg-[#475467] text-white p-1 rounded-3xl flex flex-row items-center justify-center gap-5 w-[10%]"
                >
                  <svg
                    width="20"
                    height="33"
                    viewBox="0 0 24 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.3178 27.8496C15.5561 27.8496 14.8783 27.3399 14.6691 26.6101L12.6448 19.5473L5.55985 17.5294C4.8277 17.3208 4.31641 16.6451 4.31641 15.8861C4.31641 15.1164 4.81311 14.4509 5.55243 14.2298C7.10916 13.7642 14.8644 11.5898 19.4535 10.3059C20.9555 9.88565 22.3353 11.268 21.9126 12.7693C20.6243 17.3452 18.4457 25.0667 17.979 26.6175C17.7572 27.3545 17.0896 27.8496 16.3178 27.8496Z"
                      stroke="white"
                      strokeWidth="3"
                    />
                    <path
                      d="M12.7812 26.957L7.60128 32.1208"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.707 25.5801L8.28971 27.9898"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.91016 20.416L3.80218 23.5143"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7.94531 22.8262L4.83733 25.9244"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.707 22.8262L5.52706 27.9899"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5.18359 20.0723L1.38495 23.859"
                      stroke="#DEDEDE"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="font-poppins font-semibold text-sm text-white">
                    SEND
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {isPopupOpens && (
        <div className="h-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[60%] overflow-hidden flex flex-col justify-center items-center">
            <video
              className="w-[100%] h-[50%] object-cover" // Ensure the video covers the container
              autoPlay
              onEnded={handleVideoEnd}
              src={vidname}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegimeBuilder;
