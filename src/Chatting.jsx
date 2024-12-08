import React, { useEffect, useState } from "react";
import { UIKitSettingsBuilder, CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChatConversationsWithMessages } from "@cometchat/chat-uikit-react"; // Import the component

const COMETCHAT_CONSTANTS = {
  APP_ID: "2679043e0d2ce72a", // Replace with your App ID
  REGION: "in", // Replace with your App Region
  AUTH_KEY: "3a80812c5b8b6208320802cf8223610a5dd4c524", // Replace with your Auth Key
};


const Chatting = ({ uname }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

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

        // Check if a user is logged in before logging out
        CometChatUIKit.getLoggedinUser()
          .then((user) => {
            if (user) {
              // Check if the currently logged-in user is the same as the UID
              if (user.uid !== uname) {
                // If the UID does not match, log the user out and then log in
                CometChatUIKit.logout()
                  .then(() => {
                    console.log("Previous user logged out successfully.");
                    loginUser();
                  })
                  .catch((error) => {
                    console.error("Logout Failed:", error);
                    loginUser(); // Proceed with login if logout fails
                  });
              } else {
                console.log("User is already logged in with the same UID.");
                setIsUserLoggedIn(true); // Mark the user as logged in without logging out
              }
            } else {
              // If no user is logged in, directly proceed with login
              loginUser();
            }
          })
          .catch((error) => {
            console.error("Error checking logged-in user:", error);
            loginUser(); // Proceed with login if error occurs while checking login status
          });
      })
      .catch((error) => {
        console.error("CometChat UI Kit initialization failed with error:", error);
      });
  }, [isLoginInProgress]);

  const loginUser = () => {
    if (!isLoginInProgress) {
      setIsLoginInProgress(true);
      
      // Create user if not already created
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          apikey: COMETCHAT_CONSTANTS.AUTH_KEY, // Use the correct Auth Key
        },
        body: JSON.stringify({
          metadata: { "@private": { email: "user@email.com", contactNumber: "0123456789" } },
          uid: uname,
          name: uname,
        }),
      };

      // Fetch request to create the user if needed
      fetch(`https://${COMETCHAT_CONSTANTS.APP_ID}.api-in.cometchat.io/v3/users`, options)
        .then((res) => res.json())
        .then((res) => {
          console.log("User creation response:", res);
          // After creating the user, proceed with logging them in
          CometChatUIKit.login(uname)
            .then((loggedInUser) => {
              console.log("Login Successful:", loggedInUser);
              setIsUserLoggedIn(true); // Mark user as logged in
              setIsLoginInProgress(false);
            })
            .catch((error) => {
              console.error("Login Failed:", error);
              setIsLoginInProgress(false);
            });
        })
        .catch((err) => {
          console.error("User creation failed:", err);
          setIsLoginInProgress(false);
        });
    }
  };

  return (
    <div className="p-5 flex flex-col h-screen">
     <h1>{isUserLoggedIn ? `Welcome ${uname}` : "Logging In..."}</h1>
      {/* Render the Conversations with Messages component only if the user is logged in */}
      {isUserLoggedIn && (
        <div style={{ height: "800px", border: "1px solid #ccc" }}>
          <CometChatConversationsWithMessages />
        </div>
      )}
    </div>
  );
};

export default Chatting;
