import React, { useEffect, useState } from "react";
import { UIKitSettingsBuilder, CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChatConversationsWithMessages } from "@cometchat/chat-uikit-react"; // Import the component

const COMETCHAT_CONSTANTS = {
  APP_ID: "2679043e0d2ce72a", // Replace with your App ID
  REGION: "in", // Replace with your App Region
  AUTH_KEY: "3a80812c5b8b6208320802cf8223610a5dd4c524", // Replace with your Auth Key
};

// Define the UID for login
const UID = "anirudh"; // Replace with your UID

const Chatting = ({ uname }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false); // Add a state to track login status

  useEffect(() => {
    const UIKitSettings = new UIKitSettingsBuilder()
      .setAppId(COMETCHAT_CONSTANTS.APP_ID)
      .setRegion(COMETCHAT_CONSTANTS.REGION)
      .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
      .subscribePresenceForAllUsers()
      .build();

    // Initialize CometChat UI Kit
    CometChatUIKit.init(UIKitSettings)
      .then(() => {
        console.log("CometChat UI Kit initialized successfully.");

        // Check if the user is already logged in
        CometChatUIKit.getLoggedinUser().then((user) => {
          if (!user && !isLoginInProgress) {
            // If not logged in and no login is in progress
            setIsLoginInProgress(true); // Mark login as in progress
            CometChatUIKit.login(UID)
              .then((loggedInUser) => {
                console.log("Login Successful:", loggedInUser);
                setIsUserLoggedIn(true);  // Mark user as logged in
                setIsLoginInProgress(false); // Reset login in progress state
              })
              .catch((error) => {
                console.error("Login Failed:", error);
                setIsLoginInProgress(false); // Reset login in progress state
              });
          } else {
            console.log("User already logged in:", user);
            setIsUserLoggedIn(true);  // Mark user as logged in
          }
        });
      })
      .catch((error) => {
        console.error("CometChat UI Kit initialization failed with error:", error);
      });
  }, [isLoginInProgress]); // Add isLoginInProgress as a dependency to avoid unnecessary re-renders
  return (
    <div className="p-5 flex flex-col h-screen">
     <h1>{isUserLoggedIn ? `Welcome ${UID}` : "Logging In..."}</h1>
      {/* Render the Conversations with Messages component only if the user is logged in */}
      {isUserLoggedIn && (
        <div style={{ height: "920px", border: "1px solid #ccc" }}>
          <CometChatConversationsWithMessages />
        </div>
      )}
    </div>
  );
};

export default Chatting;
