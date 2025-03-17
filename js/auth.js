import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
        import {
            getAuth,
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            onAuthStateChanged,
            updateProfile
        } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDwrgm6o6xQWMwFquz3bRMQUfu5xe7vkbc",
            authDomain: "authproject-62b2d.firebaseapp.com",
            projectId: "authproject-62b2d",
            storageBucket: "authproject-62b2d.firebasestorage.app",
            messagingSenderId: "749088271021",
            appId: "1:749088271021:web:f7c9864f0c7046c3aff424",
            measurementId: "G-9C2XHNCV69"
        };

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);

        const userEmail = document.querySelector("#userEmail");
        const userPassword = document.querySelector("#userPassword");
        const userName = document.querySelector("#userName");
        const usernameField = document.querySelector("#usernameField");
        const authForm = document.querySelector("#auth-form");
        const signInBtn = document.querySelector("#signInBtn");
        const signUpBtn = document.querySelector("#signUpBtn");
        const toggleModeBtn = document.querySelector("#toggleModeBtn");

        let isSignUp = false;

        toggleModeBtn.addEventListener('click', () => {
            isSignUp = !isSignUp;
            if (isSignUp) {
                usernameField.style.display = "block";
                toggleModeBtn.textContent = "تسجيل الدخول بحساب موجود";
                signInBtn.style.display = "none";
                signUpBtn.style.display = "block";
            } else {
                usernameField.style.display = "none";
                toggleModeBtn.textContent = "إنشاء حساب جديد";
                signInBtn.style.display = "block";
                signUpBtn.style.display = "none";
            }
        });

        signUpBtn.style.display = "none";

        const userSignUp = async () => {
            const signUpEmail = userEmail.value;
            const signUpPassword = userPassword.value;
            const displayName = userName.value;

            if (!displayName) {
                showNotification("الرجاء إدخال اسم المستخدم", "error");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
                const user = userCredential.user;

                await updateProfile(user, { displayName });

                showNotification("تم إنشاء الحساب بنجاح", "success");
                window.location.href = `userprofile.html?displayName=${encodeURIComponent(displayName)}`;
            } catch (error) {
                const errorCode = error.code;
                let arabicErrorMessage = "حدث خطأ أثناء إنشاء الحساب";
                if (errorCode === "auth/email-already-in-use") {
                    arabicErrorMessage = "البريد الإلكتروني مستخدم بالفعل";
                } else if (errorCode === "auth/invalid-email") {
                    arabicErrorMessage = "البريد الإلكتروني غير صالح";
                } else if (errorCode === "auth/weak-password") {
                    arabicErrorMessage = "كلمة المرور ضعيفة جدًا";
                }
                showNotification(arabicErrorMessage, "error");
            }
        };

        const userSignIn = async () => {
            const signInEmail = userEmail.value;
            const signInPassword = userPassword.value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
                const user = userCredential.user;
                showNotification("تم تسجيل الدخول بنجاح", "success");
                window.location.href = `userprofile.html?displayName=${encodeURIComponent(user.displayName || "مستخدم بدون اسم")}`;
            } catch (error) {
                const errorCode = error.code;
                let arabicErrorMessage = "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.";
                if (errorCode === "auth/invalid-email") {
                    arabicErrorMessage = "البريد الإلكتروني غير صالح";
                } else if (errorCode === "auth/user-not-found") {
                    arabicErrorMessage = "لم يتم العثور على المستخدم";
                } else if (errorCode === "auth/wrong-password") {
                    arabicErrorMessage = "كلمة المرور غير صحيحة";
                }
                showNotification(arabicErrorMessage, "error");
            }
        };

        const checkAuthState = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    authForm.style.display = "none";
                    window.location.href = `userprofile.html?displayName=${encodeURIComponent(user.displayName || "مستخدم بدون اسم")}`;
                } else {
                    authForm.style.display = "block";
                }
            });
        };

        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 left-4 px-6 py-3 rounded-md shadow-lg ${
                type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        checkAuthState();

        signUpBtn.addEventListener('click', userSignUp);
        signInBtn.addEventListener('click', userSignIn);