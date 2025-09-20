const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
// Initialize Firebase Admin SDK
const serviceAccount = require('./admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = 3000;

const OTP_EXPIRATION_MINUTES = 10;
const PASSWORD_RESET_EXPIRATION_MINUTES = 15;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CureZ DB server is running!');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password, name, age, gender } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: 'Missing email or password.' });
  }

  try {
    const verificationRef = db.collection('email_verifications').doc(email);
    const verificationDoc = await verificationRef.get();

    if (!verificationDoc.exists) {
      return res.status(400).send({ error: 'Please verify your email before signing up.' });
    }

    const verificationData = verificationDoc.data();
    if (!verificationData || verificationData.verified !== true) {
      return res.status(400).send({ error: 'Email verification is pending. Please verify your email.' });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    await verificationRef.set(
      {
        used: true,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const profileData = {
      email: email,
      emailVerified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (name) {
      profileData.name = name;
    }

    if (gender) {
      profileData.gender = gender;
    }

    if (age) {
      profileData.age = Number.parseInt(age);
    }

    await db.collection('users').doc(userRecord.uid).set(profileData, { merge: true });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
    // NOTE: This is a simplified login for server-side session management.
    // For client-side apps, you would typically use Firebase's client-side SDKs
    // to sign in and then send the ID token to the backend for verification.
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().getUserByEmail(email);

        const verificationDoc = await db.collection('email_verifications').doc(email).get();
        if (verificationDoc.exists) {
            const verificationData = verificationDoc.data();
            if (verificationData && verificationData.verified !== true) {
                return res.status(403).send({ error: 'Please verify your email before logging in.' });
            }
        }

        // This is a simplified login and does not actually verify the password.
        // In a real application, you should use the Firebase client-side SDK to sign in the user
        // and then send the ID token to the backend for verification.
        res.status(200).send({ uid: userRecord.uid, message: "Login successful (simulation)" });
    } catch (error) {
        res.status(401).send({ error: "Invalid credentials. Please check your email and password." });
    }
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: 'Email is required to send an OTP.' });
    }

    try {
        const otp = generateOtp();
        await db.collection('email_verifications').doc(email).set({
            otp,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            verified: false,
            used: false,
        });

        console.log(`Generated OTP ${otp} for ${email}.`);
        res.status(200).send({ message: 'Verification OTP generated successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).send({ error: 'Email and OTP are required.' });
    }

    try {
        const verificationRef = db.collection('email_verifications').doc(email);
        const verificationDoc = await verificationRef.get();

        if (!verificationDoc.exists) {
            return res.status(404).send({ error: 'No OTP request found for this email.' });
        }

        const data = verificationDoc.data();
        const createdAt = data && data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;

        if (!createdAt) {
            return res.status(400).send({ error: 'OTP timestamp is invalid. Please request a new OTP.' });
        }

        const now = new Date();
        if (now.getTime() - createdAt.getTime() > OTP_EXPIRATION_MINUTES * 60 * 1000) {
            return res.status(400).send({ error: 'OTP has expired. Please request a new one.' });
        }

        if (data.verified === true) {
            return res.status(200).send({ message: 'Email already verified.' });
        }

        if (data.otp !== otp) {
            return res.status(400).send({ error: 'Invalid OTP. Please try again.' });
        }

        await verificationRef.set(
            {
                verified: true,
                verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        res.status(200).send({ message: 'OTP verified successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: 'Email is required.' });
    }

    try {
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (authError) {
            if (authError.code === 'auth/user-not-found') {
                return res.status(404).send({ error: 'No account found with this email.' });
            }
            throw authError;
        }

        const resetCode = generateOtp();
        await db.collection('password_resets').doc(email).set({
            otp: resetCode,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            used: false,
            uid: userRecord.uid,
        });

        console.log(`Generated password reset code ${resetCode} for ${email}.`);
        res.status(200).send({ message: 'Password reset code generated successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).send({ error: 'Email, OTP, and new password are required.' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).send({ error: 'New password must be at least 6 characters long.' });
    }

    try {
        const resetRef = db.collection('password_resets').doc(email);
        const resetDoc = await resetRef.get();

        if (!resetDoc.exists) {
            return res.status(404).send({ error: 'No password reset request found for this email.' });
        }

        const data = resetDoc.data();
        if (!data || data.used) {
            return res.status(400).send({ error: 'This reset code has already been used. Please request a new one.' });
        }

        const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
        if (!createdAt || new Date().getTime() - createdAt.getTime() > PASSWORD_RESET_EXPIRATION_MINUTES * 60 * 1000) {
            return res.status(400).send({ error: 'Reset code has expired. Please request a new one.' });
        }

        if (data.otp !== otp) {
            return res.status(400).send({ error: 'Invalid reset code. Please try again.' });
        }

        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (authError) {
            if (authError.code === 'auth/user-not-found') {
                return res.status(404).send({ error: 'No account found with this email.' });
            }
            throw authError;
        }
        await admin.auth().updateUser(userRecord.uid, { password: newPassword });

        await resetRef.set(
            {
                used: true,
                usedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        res.status(200).send({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Get latest summary route
app.get('/get-summary/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            res.status(404).send({ error: 'No summary found for this user.' });
        } else {
            res.status(200).send(doc.data());
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Save summary route
app.post('/save-summary', async (req, res) => {
  const { uid, summary } = req.body;
  if (!uid || !summary) {
    return res.status(400).send({ error: 'Missing uid or summary' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.set({ latestSummary: summary }, { merge: true });
    res.status(200).send({ message: 'Summary saved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Save name route
app.post('/save-name', async (req, res) => {
    const { uid, name } = req.body;
    if (!uid || !name) {
        return res.status(400).send({ error: 'Missing uid or name' });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        await userRef.set({ name: name }, { merge: true });
        res.status(200).send({ message: 'Name saved successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update profile route
app.post('/update-profile', async (req, res) => {
    const { uid, name, age, gender } = req.body;
    if (!uid) {
        return res.status(400).send({ error: 'Missing uid' });
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (age !== undefined && age !== "") updateData.age = Number.parseInt(age);
        if (gender !== undefined) updateData.gender = gender;

        await userRef.set(updateData, { merge: true });
        res.status(200).send({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get user data route (including mood data from latest summary)
app.get('/user/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            res.status(404).send({ error: 'User not found' });
        } else {
            const userData = doc.data();
            res.status(200).send(userData);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
