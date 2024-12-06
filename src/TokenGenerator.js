import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";


const appID = 1296580694;
const serverSecret = "47e42973e5492120a04fc8c8b839232a";

export const generateKitToken = (documentId, userId, userName) => {
  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    documentId,
    userId,
    userName
  );
};
