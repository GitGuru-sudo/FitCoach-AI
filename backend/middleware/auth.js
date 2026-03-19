import admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    throw new Error("Missing Firebase admin environment variables");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    }),
  });
};

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    initializeFirebaseAdmin();

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing bearer token" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};
