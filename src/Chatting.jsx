import React, { useEffect, useState, useRef } from "react";
import { ZIM } from "zego-zim-web";
import { ZIMKitManager } from "@zegocloud/zimkit-react";
import {
  PaperClipIcon,
  PaperAirplaneIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";

var appID = 1296580694;
ZIM.create({ appID });
var zim = ZIM.getInstance();

const Chatting = ({ uname }) => {
  const [toUserId, setToUserId] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversationList, setConversationList] = useState([]);
  const [usersWhoMessagedMe, setUsersWhoMessagedMe] = useState([]);
  const [offlineMessageCounts, setOfflineMessageCounts] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationSelected, setConversationSelected] = useState(false);
  const [addId, setAddId] = useState("");
  const [retryCount, setRetryCount] = useState({});
  const messagesEndRef = useRef(null);
  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var generatedUserId = parsedData.user_id;

  useEffect(() => {
    ZIM.create({ appID });
  }, []);

  useEffect(() => {
    const initChat = async () => {
      try {
        const zimKit = new ZIMKitManager();
        setUserId(uname);
        setUserName(uname);

        const generatedToken = zimKit.generateKitTokenForTest(
          appID,
          "47e42973e5492120a04fc8c8b839232a", // Replace with your actual serverSecret
          generatedUserId
        );

        if (generatedToken) {
          setToken(generatedToken);
          console.log("Generated token:", generatedToken);
        } else {
          throw new Error("Failed to generate token");
        }
      } catch (error) {
        console.error("Error generating token:", error);
      }
    };

    initChat();
    handleLogin();

    // Set up listener for receiving messages
    zim.on(
      "receivePeerMessage",
      function (zim, { messageList, fromConversationID }) {
        console.log(
          "Received peer message:",
          messageList,
          "From:",
          fromConversationID
        );

        if (messageList.length > 0) {
          // Process the new messages and update the conversations state
          setMessages((prevMessages) => [
            ...prevMessages,
            ...messageList.map((message) => ({
              text: message.message,
              from: fromConversationID,
              to: userId,
              type: message.type === 11 ? "image" : "received",
              fileDownloadUrl: message.fileDownloadUrl || null,
              fileName: message.fileName || null,
            })),
          ]);

          // setConversations((prevConversations) => {
          //   return prevConversations.map((conversation) =>
          //     conversation.id === fromConversationID
          //       ? {
          //           ...conversation,
          //           lastMessage: messageList[0], // Update with the last message
          //           unreadMessageCount: conversation.unreadMessageCount + 1, // Increment unread count
          //         }
          //       : conversation
          //   );
          // });

          fetchConversations();

          // setUsersWhoMessagedMe((prevUsers) => {
          //   if (!prevUsers.includes(fromConversationID)) {
          //     return [...prevUsers, fromConversationID];
          //   }
          //   return prevUsers;
          // });
        }
      }
    );

    // Cleanup listener when the component unmounts
    return () => {
      zim.off("receivePeerMessage");
    };
  }, [userId]); // userId is a dependency for re-initializing chat on change

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalImage, setModalImage] = useState(null); // State to store the image URL for the modal

  // Function to handle modal open when image is clicked
  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl); // Set the image to be shown in the modal
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle modal close when user clicks close button
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setModalImage(null); // Clear the modal image
  };

  const handleImageError = (msg, maxRetries = 3) => {
    const currentRetries = retryCount[msg.fileDownloadUrl] || 0;
    if (currentRetries < maxRetries) {
      // Retry after a delay
      setTimeout(() => {
        setRetryCount((prevState) => ({
          ...prevState,
          [msg.fileDownloadUrl]: currentRetries + 1,
        }));
        console.log(`Retrying image load for: ${msg.fileDownloadUrl}`);
      }, 2000); // Retry after 2 seconds
    } else {
      console.error(`Max retries reached for image: ${msg.fileDownloadUrl}`);
    }
  };
  const handleLogin = () => {
    if (!token || !userId) {
      console.warn("Token or User ID is missing.");
      return;
    }
    try {
      const newUserDetails = { uname, userID: userId };
      console.log("user id", newUserDetails, token);
      zim
        .login(newUserDetails, token)
        .then(async function (res) {
          console.log("User logged in successfully:", res);

          // Fetch the conversation list after successful login
          var config = {
            nextConversation: null, // Latest conversation
            count: 20, // Fetch 20 conversations per query
          };

          zim
            .queryConversationList(config)
            .then(function ({ conversationList }) {
              console.log("Fetched conversations:", conversationList);

              // Process each conversation to extract required properties
              const processedConversations = conversationList.map(
                (conversation) => ({
                  id: conversation.conversationID,
                  type: conversation.type,
                  lastMessage: conversation.lastMessage || {
                    message: "No messages yet",
                  }, // Extract last message
                  unreadMessageCount: conversation.unreadMessageCount || 0,
                  notificationStatus:
                    conversation.notificationStatus || "enabled", // Default to "enabled"
                  conversationName: conversation.conversationName || "Unnamed", // Default username if missing
                  conversationAvatarUrl:
                    conversation.conversationAvatarUrl || "default-avatar-url", // Default avatar if missing
                })
              );

              console.log("Processed conversations:", processedConversations);
              setConversations(processedConversations); // Store the processed conversations in state

              // Calculate total unread messages
              const totalUnreadMessages = processedConversations.reduce(
                (sum, conversation) => sum + conversation.unreadMessageCount,
                0
              );
              console.log("Total unread messages:", totalUnreadMessages);

              // Optionally clear unread message counts
              processedConversations.forEach((conversation) => {
                zim
                  .clearConversationUnreadMessageCount(
                    conversation.id,
                    conversation.type
                  )
                  .then((res) => {
                    console.log(
                      `Cleared unread messages for conversation: ${conversation.id}`,
                      res
                    );
                  })
                  .catch((err) => {
                    console.error(
                      `Failed to clear unread messages for conversation: ${conversation.id}`,
                      err
                    );
                  });
              });
            })
            .catch(function (err) {
              console.error("Error fetching conversation list:", err);
            });
        })
        .catch(function (err) {
          console.error("Error during login:", err);
        });
    } catch (error) {
      console.error("Error during login attempt:", error);
    }
  };

  // const fetchConversations = async () => {
  //   try {
  //     const result = await zim.queryConversations(0, 20);
  //     console.log("Fetched conversations:", result);

  //     if (result && result.conversationList) {
  //       const formattedConversations = result.conversationList.map((conv) => ({
  //         userId: conv.peerID,
  //         userName: conv.peerName || conv.peerID,
  //       }));

  //       setConversationList(formattedConversations);
  //     } else {
  //       setConversationList([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching conversations:", error);
  //   }
  // };

  const fetchHistoricalMessages = async (toUserId) => {
    if (!toUserId) {
      console.warn("Recipient user ID is required to fetch history.");
      return;
    }
    try {
      const config = {
        nextMessage: null,
        count: 30,
        reverse: true,
      };

      const result = await zim.queryHistoryMessage(toUserId, 0, config);
      console.log("Fetched historical messages:", result.messageList);

      const formattedMessages = result.messageList.map((message) => ({
        text: message.message,
        from: message.senderUserID === userId ? userId : toUserId,
        to: message.senderUserID === userId ? toUserId : userId,
        type: message.type === ZIM.MessageType.Image ? "image" : "received",
        fileDownloadUrl:
          message.fileDownloadUrl || message.extendedData?.fileUrl || null, // Fallback to extended data if needed
        fileName: message.fileName || null,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching historical messages:", error);
    }
  };

  const fetchOfflineMessages = async () => {
    try {
      const result = await zim.queryHistoryMessage(userId, 0, {
        nextMessage: null,
        count: 30,
        reverse: true,
      });

      const formattedMessages = result.messageList.map((message) => ({
        text: message.message,
        from: message.senderUserID,
        to: userId,
        type: message.type === 11 ? "image" : "received",
        fileDownloadUrl: message.fileDownloadUrl || null,
        fileName: message.fileName || null,
      }));

      const senderMessageCount = result.messageList.reduce((acc, message) => {
        acc[message.senderUserID] = (acc[message.senderUserID] || 0) + 1;
        return acc;
      }, {});

      setMessages((prevMessages) => [...formattedMessages, ...prevMessages]);
      setUsersWhoMessagedMe((prevUsers) => {
        const newUsers = result.messageList.map((msg) => msg.senderUserID);
        return [...new Set([...prevUsers, ...newUsers])];
      });

      setOfflineMessageCounts(senderMessageCount);
    } catch (error) {
      console.error("Error fetching offline messages:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]); // Save the selected image
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if it's an image or a file and set it accordingly
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        setSelectedFile(null); // Clear any previously selected file
      } else {
        setSelectedFile(file);
        setSelectedImage(null); // Clear any previously selected image
      }

      // After setting the selected file, automatically send the message
      handleSendMessage(file);
    }
  };
  const handleSendMessage = (file = null) => {
    if (!toUserId) {
      console.warn("Recipient user ID is required");
      return;
    }

    let messageType;
    let messageContent;
    const config = { priority: 2 };

    // Check for text message
    if (newMessage.trim()) {
      messageType = {
        type: ZIM.MessageType.Text, // Text message type
        message: newMessage.trim(),
      };
      messageContent = "Text";
    }
    // Check for image message (if it's an image file)
    else if (selectedImage) {
      messageContent = "Image";
      messageType = {
        type: ZIM.MessageType.Image, // Image message type
        fileLocalPath: selectedImage, // Local image file
        fileDownloadUrl: "", // Initially empty, to be updated after upload
        fileName: selectedImage.name,
        fileSize: selectedImage.size,
        fileUID: "", // Generate a unique ID for the image
      };
    }
    // Check for file message (if it's not an image, handle it as a file)
    else if (file || selectedFile) {
      const selected = file || selectedFile;
      const fileType = selected.type;
      const isImage = fileType.startsWith("image/");
      const isPdf = fileType === "application/pdf";

      if (isImage) {
        // If the file is an image, send it as an image message
        messageContent = "Image";
        messageType = {
          type: ZIM.MessageType.Image,
          fileLocalPath: selected,
          fileDownloadUrl: "",
          fileName: selected.name,
          fileSize: selected.size,
          fileUID: "",
        };
      } else if (isPdf) {
        // If the file is a PDF, send it as a file message and show preview link
        messageContent = "PDF";
        messageType = {
          type: ZIM.MessageType.File,
          fileLocalPath: selected,
          fileDownloadUrl: "",
          fileName: selected.name,
          fileSize: selected.size,
          fileUID: "",
        };
      } else {
        // Handle other file types (e.g., DOCX, TXT, etc.)
        messageContent = "File";
        messageType = {
          type: ZIM.MessageType.File,
          fileLocalPath: selected,
          fileDownloadUrl: "",
          fileName: selected.name,
          fileSize: selected.size,
          fileUID: "",
        };
      }
    } else {
      console.warn("No valid message content");
      return;
    }

    if (!zim) {
      console.error("zim is not initialized yet");
      return;
    }

    // Send the message using ZEGOCLOUD SDK
    zim
      .sendMessage(messageType, toUserId, 0, config)
      .then(({ message }) => {
        console.log(`${messageContent} message sent successfully:`, message);

        // For image or file, we should update the fileDownloadUrl after uploading
        const updatedMessage = {
          text: message.fileName || message.message,
          from: userId,
          to: toUserId,
          type:
            message.type === ZIM.MessageType.Image
              ? "image"
              : message.type === ZIM.MessageType.File
              ? "file"
              : "sent",
          fileDownloadUrl: message.fileDownloadUrl || "", // URL after successful upload
          fileName: message.fileName || null,
        };

        // Display the media (image, PDF, or other files) in the chat
        setMessages((prevMessages) => [...prevMessages, updatedMessage]);

        // Reset input fields and clear selected media
        setNewMessage(""); // Clear the new message
        setSelectedImage(null); // Clear the selected image
        setSelectedFile(null); // Clear the selected file
      })
      .catch((err) => {
        console.error(`Error sending ${messageContent} message:`, err);
      });
  };

  const handleClick = () => {
    document.getElementById("hidden-file-input").click(); // Trigger the hidden input
  };

  const handleConversationClick = (conversation) => {
    const {
      conversationID,
      lastMessage,
      conversationName,
      unreadMessageCount,
      type,
    } = conversation;

    const toUserId =
      lastMessage.senderUserID === userId
        ? conversationID
        : lastMessage.senderUserID;

    // Set the toUserId and conversationID for further message fetching
    setToUserId(toUserId);

    // Fetch the conversation messages based on the selected conversation
    fetchHistoricalMessages(toUserId);

    // Set the selected conversation and mark as conversation selected
    setSelectedConversation(conversation);
    setConversationSelected(true);

    // Clear the unread message count for the clicked conversation
    zim
      .clearConversationUnreadMessageCount(conversationID, type)
      .then((res) => {
        console.log(
          `Cleared unread messages for conversation: ${conversationID}`,
          res
        );

        // Update the conversations state to set unreadMessageCount to 0 for the clicked conversation
        setConversations((prevConversations) =>
          prevConversations.map((item) =>
            item.conversationID === conversationID
              ? { ...item, unreadMessageCount: 0 } // Set unread message count to 0
              : item
          )
        );
      })
      .catch((err) => {
        console.error(
          `Failed to clear unread messages for conversation: ${conversationID}`,
          err
        );
      });
  };

  const handleAddFriend = () => {
    if (addId.trim() && token && userId) {
      console.log(addId);
      zim
        .addFriend(addId, {
          wording: "Hello!",
          friendAlias: "Mark",
          friendAttributes: { k0: "SZ" },
        })
        .then((res) => {
          const friendInfo = res.friendInfo;
          console.log("Friend added:", friendInfo);

          setIsModalOpen(false);

          console.log(addId);
          sendMessageToFriend(addId);

          // Refresh conversations after adding a friend
          fetchConversations();
        })
        .catch((error) => {
          console.error("Error adding friend:", error);
        });
    } else {
      alert("Please enter a valid user ID and ensure you are logged in.");
    }
  };

  const sendMessageToFriend = (toUserId) => {
    try {
      const config = {
        priority: 1, // Low priority by default
      };

      const messageTextObj = {
        type: 1,
        message: `Hello, ${toUserId}!\n Do reply to this message!`,
      };
      zim
        .sendMessage(messageTextObj, toUserId, 0, config)
        .then(({ message }) => {
          console.log("Message sent:", message);

          // Refresh conversations after sending a message
          fetchConversations();
        })
        .catch((err) => {
          console.error("Error sending message:", err);
        });
    } catch (error) {
      console.error("Error in sendMessageToFriend:", error);
    }
  };

  const fetchConversations = () => {
    const config = {
      nextConversation: null, // Latest conversation
      count: 20, // Fetch 20 conversations per query
    };

    zim
      .queryConversationList(config)
      .then(({ conversationList }) => {
        const processedConversations = conversationList.map((conversation) => ({
          id: conversation.conversationID,
          type: conversation.type,
          lastMessage: conversation.lastMessage || {
            message: "No messages yet",
          },
          unreadMessageCount: conversation.unreadMessageCount || 0,
          notificationStatus: conversation.notificationStatus || "enabled",
          conversationName: conversation.conversationName || "Unnamed",
          conversationAvatarUrl:
            conversation.conversationAvatarUrl || "default-avatar-url",
        }));

        console.log("Processed conversations:", processedConversations);
        setConversations(processedConversations);

        // Calculate total unread messages
        const totalUnreadMessages = processedConversations.reduce(
          (sum, conversation) => sum + conversation.unreadMessageCount,
          0
        );
        console.log("Total unread messages:", totalUnreadMessages);
      })
      .catch((err) => {
        console.error("Error fetching conversation list:", err);
      });
  };

  const handleAddNewClick = () => {
    setIsModalOpen(true); // Open the modal when "Add New" is clicked
    setAddId(""); // Clear addId when modal opens
  };

  const handleDeleteConversation = (conversationID, conversationType) => {
    zim
      .deleteConversation(conversationID, conversationType, {})
      .then((res) => {
        console.log(
          `Conversation ${conversationID} deleted successfully:`,
          res
        );

        // Remove the deleted conversation from state
        setConversations((prevConversations) =>
          prevConversations.filter((conv) => conv.id !== conversationID)
        );
      })
      .catch((err) => {
        console.error(`Failed to delete conversation ${conversationID}:`, err);
      });
  };
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleRightClick = (e, msg) => {
    e.preventDefault(); // Prevent the default browser context menu
    setSelectedMessage(msg); // Save the message for deletion
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = () => {
    if (selectedMessage) {
      handleDeleteMessage(
        selectedMessage.id,
        selectedMessage.conversationID,
        selectedMessage.conversationType
      );
    }
    setContextMenu(null); // Close the menu
    setSelectedMessage(null);
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleDeleteMessage = (messageID, conversationID, conversationType) => {
    const deleteMessageList = [messageID]; // Specify the message ID to delete

    zim
      .deleteMessages(deleteMessageList, conversationID, conversationType, {})
      .then(({ conversationID, conversationType }) => {
        console.log(
          `Message ${messageID} deleted successfully in conversation ${conversationID}.`
        );

        // Optionally update the state to reflect the deleted message
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== messageID)
        );
      })
      .catch((err) => {
        console.error(`Failed to delete message ${messageID}:`, err);
      });
  };

  return (
    <div className="p-5 flex flex-col h-screen">
      {/* Display Conversation List when no conversation is selected */}
      {!selectedConversation ? (
        <div className="conversation-list border p-2 m-2 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3>Conversations</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={handleAddNewClick}
            >
              <span className="mr-2">+</span> Add New
            </button>
          </div>

          {conversations.map((conversation, index) => (
            <div
              key={index}
              className="conversation-item p-4 m-2 cursor-pointer bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="flex items-center">
                <img
                  src={conversation.conversationAvatarUrl}
                  alt={conversation.conversationName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-grow">
                  <p className="text-base font-semibold text-gray-800">
                    {conversation.conversationName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
                {conversation.unreadMessageCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {conversation.unreadMessageCount}
                  </span>
                )}
              </div>
            </div>
          ))}
          {/* Modal for adding new friend */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4">Enter User ID</h2>
                <input
                  type="text"
                  className="border p-2 w-full rounded-md mb-4"
                  placeholder="Enter User ID" // Placeholder text
                  value={addId} // Binds the input value to the addId state
                  onChange={(e) => setAddId(e.target.value)} // Updates the addId state as user types
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFriend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add Friend
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Message box and send message area when conversation is selected
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            {/* Back Button */}
            <button
              onClick={() => {
                zim.logout();
                // Reset the unread message count for all conversations
                setConversations((prevConversations) =>
                  prevConversations.map((conversation) => ({
                    ...conversation,
                    unreadMessageCount: 0, // Reset unread message count to 0
                  }))
                );

                // Set the selected conversation to null when navigating back to the list
                setSelectedConversation(null);
              }}
              className="back-button text-blue-500 flex items-center p-2 cursor-pointer"
            >
              <span className="ml-2">Back</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (selectedConversation) {
                  handleDeleteConversation(
                    selectedConversation.id,
                    selectedConversation.type
                  );
                  setSelectedConversation(null); // Navigate back after deletion
                }
              }}
              className="delete-button text-red-500 flex items-center p-2 ml-auto cursor-pointer"
            >
              <span className="ml-2">Delete</span>
            </button>
          </div>

          <div className="messages-list border p-2 m-2 flex-grow overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 m-1 ${
                  msg.from === uname
                    ? "text-right flex justify-end"
                    : "text-left flex justify-start"
                }`}
              >
                <div
                  className={`message-bubble p-2 rounded-md ${
                    msg.from === uname ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <p
                    className={`font-bold ${
                      msg.from === uname ? "text-blue-500" : "text-green-500"
                    }`}
                  >
                    {msg.from === uname ? "You" : `From: ${msg.from}`}
                  </p>

                  {/* Handle Image Messages */}
                  {msg.type === "image" && msg.fileDownloadUrl ? (
                    <div
                      className={`${
                        msg.from === uname ? "text-right" : "text-left"
                      }`}
                    >
                      <img
                        src={msg.fileDownloadUrl}
                        alt={msg.fileName}
                        onError={() => handleImageError(msg)} // Image error handling
                        onClick={() => handleImageClick(msg.fileDownloadUrl)} // Open modal on image click
                        className="max-w-[500px] max-h-[500px] rounded-md cursor-pointer" // Styling for the thumbnail
                      />

                      {/* Full-Screen Modal for Images */}
                      {isModalOpen && modalImage === msg.fileDownloadUrl && (
                        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
                          <div className="relative max-w-full max-h-full overflow-hidden">
                            <img
                              src={modalImage} // Display the image that was clicked
                              alt={msg.fileName}
                              className="max-w-[95vw] max-h-[95vh] object-contain rounded-md" // Limit image size to 95% of the viewport size
                            />
                            {/* Close Button */}
                            <button
                              onClick={handleCloseModal} // Close modal
                              className="absolute top-2 right-2 text-black bg-white bg-opacity-70 rounded-full p-8 text-4xl"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (msg.type === "sent" || msg.type === "received") &&
                    msg.fileDownloadUrl ? (
                    <div
                      className={`${
                        msg.from === userId ? "text-right" : "text-left"
                      }`}
                    >
                      <div>
                        <p className="text-blue-500">
                          {msg.fileName || "Unknown File"}
                        </p>
                      </div>

                      {/* Render File Previews (PDF, DOCX, XLS) */}
                      {msg.fileName && msg.fileName.endsWith(".pdf") ? (
                        <iframe
                          src={msg.fileDownloadUrl}
                          title="PDF Preview"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                        ></iframe>
                      ) : msg.fileName &&
                        (msg.fileName.endsWith(".docx") ||
                          msg.fileName.endsWith(".doc")) ? (
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                            msg.fileDownloadUrl
                          )}&embedded=true`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          title="Word Document Preview"
                        ></iframe>
                      ) : msg.fileName &&
                        (msg.fileName.endsWith(".xls") ||
                          msg.fileName.endsWith(".xlsx")) ? (
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                            msg.fileDownloadUrl
                          )}`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          title="Excel Document Preview"
                        ></iframe>
                      ) : (
                        <a
                          href={msg.fileDownloadUrl}
                          download={msg.fileName}
                          className="text-blue-500 underline"
                        >
                          Download {msg.fileName}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Step 3: Add a ref at the end of the messages list */}
            <div ref={messagesEndRef} />
          </div>

          {/* Send message box (always visible after conversation is selected) */}
          <div className="send-message-box flex items-center p-2 border-t bg-white shadow-md">
            <input
              type="text"
              className="border rounded-lg flex-1 p-2"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <input
              id="hidden-file-input"
              type="file"
              accept="image/*, .pdf, .docx, .xlsx, .txt"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <PaperClipIcon
              className="upload-icon w-6 h-6 ml-2 cursor-pointer"
              onClick={() => {
                handleClick(); // Trigger the handleClick function when the icon is clicked
              }}
            />

            {/* Send button */}
            <PaperAirplaneIcon
              className="send-icon w-6 h-6 ml-2 cursor-pointer text-blue-500"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;
