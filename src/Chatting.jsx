import React, { useEffect, useState, useRef } from "react";
import { ZIM } from "zego-zim-web";
import { ZIMKitManager } from "@zegocloud/zimkit-react";
import { PaperClipIcon, PaperAirplaneIcon, LinkIcon } from "@heroicons/react/16/solid";

var appID = 1296580694; 
ZIM.create({ appID });
var zim = ZIM.getInstance();

const Chatting = ({uname}) => {
 
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
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const zimKit = new ZIMKitManager();
        const generatedUserId = `doctor001`;
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

          setUsersWhoMessagedMe((prevUsers) => {
            if (!prevUsers.includes(fromConversationID)) {
              return [...prevUsers, fromConversationID];
            }
            return prevUsers;
          });
        }
      }
    );

    return () => {
      zim.off("receivePeerMessage");
    };
  }, [userId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          await fetchConversations();
          await fetchHistoricalMessages();
          await fetchOfflineMessages();
        })
        .catch(function (err) {
          console.error("Error during login:", err);
        });
    } catch (error) {
      console.error("Error during login attempt:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const result = await zim.queryConversations(0, 20);
      console.log("Fetched conversations:", result);

      if (result && result.conversationList) {
        const formattedConversations = result.conversationList.map((conv) => ({
          userId: conv.peerID,
          userName: conv.peerName || conv.peerID,
        }));

        setConversationList(formattedConversations);
      } else {
        setConversationList([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchHistoricalMessages = async () => {
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
        type:
          message.type === 11
            ? "image"
            : message.senderUserID === userId
            ? "sent"
            : "received",
        fileDownloadUrl: message.fileDownloadUrl || null,
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

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = () => {
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
    // Check for image message
    else if (selectedImage) {
      messageContent = "Image";

      // Create the ZIMMediaMessage for image
      messageType = {
        type: ZIM.MessageType.Image, // Image type
        fileLocalPath: selectedImage, // Local image file
        fileDownloadUrl: "", // Empty URL initially, to be set once uploaded
        fileName: selectedImage.name,
        fileSize: selectedImage.size,
        fileUID: "", // You can generate a UID or handle it based on your logic
      };
    }
    // Check for file message
    else if (selectedFile) {
      messageContent = "File";

      // Create the ZIMMediaMessage for file
      messageType = {
        type: ZIM.MessageType.File, // File type
        fileLocalPath: selectedFile, // Local file
        fileDownloadUrl: "", // Empty URL initially, to be set once uploaded
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUID: "", // Unique ID for the file (handle as required)
      };
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

        setMessages((prevMessages) => [...prevMessages, updatedMessage]);
        setNewMessage("");
        setSelectedImage(null);
        setSelectedFile(null);
      })
      .catch((err) => {
        console.error(`Error sending ${messageContent} message:`, err);
      });
  };

  const handleClick = () => {
    document.getElementById("hidden-file-input").click(); // Trigger the hidden input
  };

  return (
    <div className="p-5 flex flex-col">
      {/* <label className="p-2 font-bold">Token</label>
      <input className="border p-2 m-2" value={token} readOnly />

      <label className="p-2 font-bold">Your Name</label>
      <input className="border p-2 m-2" value={userName} readOnly />

      <label className="p-2 font-bold">User ID</label>
      <input className="border p-2 m-2" value={userId} readOnly /> */}

      {/* <button
        onClick={handleLogin}
        className="border p-2 m-2 bg-green-300 hover:bg-green-400"
      >
        Login
      </button> */}

      <div className="w-1/2 flex flex-row gap-4 items-center">
        <select
          className="border p-2 m-2 w-1/2 rounded-xl px-4"
          value={toUserId}
          onChange={(e) => {
            const selectedUserId = e.target.value;
            setToUserId(selectedUserId); // Set the selected userId
          }}
        >
          <option value="" disabled>
            Select a therapist
          </option>
          <option value="Anirudh456">Anirudh456</option>
          <option value="therapist2">Therapist 2</option>
          <option value="therapist3">Therapist 3</option>
        </select>
        <LinkIcon
            className="upload-icon w-6 h-6 cursor-pointer"
            onClick={handleLogin}
          />
      </div>

      <div className="messages-list border p-2 m-2 max-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 m-1 ${
              msg.from === userId
                ? "text-right flex justify-end"
                : "text-left flex justify-start"
            }`}
          >
            <div
              className={`message-bubble p-2 rounded-md ${
                msg.from === userId ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <p
                className={`font-bold ${
                  msg.from === userId ? "text-blue-500" : "text-green-500"
                }`}
              >
                {msg.from === userId ? "You" : `From: ${msg.from}`}
              </p>

              {/* Handle image messages */}
              {msg.type === "image" && msg.fileDownloadUrl ? (
                <div
                  className={`${
                    msg.from === userId ? "text-right" : "text-left"
                  }`}
                >
                  <img
                    src={msg.fileDownloadUrl}
                    alt={msg.fileName}
                    style={{
                      maxWidth: "25%", // Adjust image size
                      height: "auto", // Maintain aspect ratio
                      display: "block", // Block display
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      console.error(
                        "Image failed to load:",
                        msg.fileDownloadUrl
                      );
                    }}
                  />
                </div>
              ) : (msg.type === "sent" || msg.type === "received") &&
                msg.fileDownloadUrl ? (
                <div
                  className={`${
                    msg.from === userId ? "text-right" : "text-left"
                  }`}
                >
                  <a href={msg.fileDownloadUrl} download>
                    {msg.fileName || "Download File"}
                  </a>
                  {console.log("File message details:", msg)}
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="w-3/4 flex flex-row items-center justify-center mx-auto">
        <div className="file-uploader w-[2%] flex justify-center">
          {/* Icon to trigger the file input */}
          <PaperClipIcon
            className="upload-icon w-6 h-6 cursor-pointer"
            onClick={handleClick}
          />
          {/* Hidden input */}
          <input
            type="file"
            id="hidden-file-input"
            accept="image/*,application/pdf,.doc,.docx,.xlsx,.txt"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hides the input
            multiple
          />
        </div>

        {/* <label className="p-2 font-bold">New Message</label> */}
        <input
          className="border p-2 m-2 rounded-xl w-[94%]"
          value={newMessage}
          placeholder="Message"
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="w-[4%] flex justify-center"
        >
          <PaperAirplaneIcon
            className="w-6 h-6 cursor-pointer"
            color="green"
            style={{ transform: "rotate(-30deg)" }}
          />
        </button>
      </div>
    </div>
  );
};

export default Chatting;
