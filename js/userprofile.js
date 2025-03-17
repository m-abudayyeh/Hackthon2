import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
const auth = getAuth(app);

const displayNameElement = document.querySelector("#displayName");
const signOutBtn = document.querySelector("#signOutBtn");
const profileImage = document.querySelector("#profileImage");
const changeImageBtn = document.querySelector("#changeImageBtn");
const imageModal = document.querySelector("#imageModal");
const imageUrlInput = document.querySelector("#imageUrl");
const saveImageBtn = document.querySelector("#saveImageBtn");
const cancelImageBtn = document.querySelector("#cancelImageBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        displayNameElement.textContent = user.displayName || "مستخدم بدون اسم";
        
        const userId = user.uid;
        const profileImageUrl = localStorage.getItem(`profileImage_${userId}`);
        
        if (profileImageUrl) {
            profileImage.src = profileImageUrl;
        }
    } else {
        window.location.href = "Register.html";
    }
});

const userSignOut = async () => {
    try {
        await signOut(auth);
        showNotification("تم تسجيل الخروج بنجاح", "success");
        window.location.href = "Register.html";
    } catch (error) {
        console.error("Sign out error:", error);
        showNotification("خطأ أثناء تسجيل الخروج", "error");
    }
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

function changeProfileImage() {
    imageModal.classList.remove("hidden");
}

function saveProfileImage() {
    const imageUrl = imageUrlInput.value.trim();
    
    if (!imageUrl) {
        showNotification("الرجاء إدخال رابط الصورة", "error");
        return;
    }
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            localStorage.setItem(`profileImage_${userId}`, imageUrl);
            profileImage.src = imageUrl;
            showNotification("تم تحديث صورة الملف الشخصي بنجاح", "success");
            imageModal.classList.add("hidden");
        }
    });
}

function closeImageModal() {
    imageModal.classList.add("hidden");
}

signOutBtn.addEventListener('click', userSignOut);
changeImageBtn.addEventListener('click', changeProfileImage);
saveImageBtn.addEventListener('click', saveProfileImage);
cancelImageBtn.addEventListener('click', closeImageModal);