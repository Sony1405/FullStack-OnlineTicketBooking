import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaMoon,
  FaSun,
  FaBell,
  FaLock,
  FaGlobe,
  FaTrash,
  FaDatabase,
  FaInfoCircle,
  FaSave,
  FaHeadset,
  FaEnvelope,
  FaQuestionCircle,
  FaBug,
} from "react-icons/fa";
import axios from "axios";
import "./SettingPage.css";
import Footer from "./Footer";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem("notifications") === "true");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [accentColor, setAccentColor] = useState(localStorage.getItem("accent") || "#fbbf24");
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });

  // Load user data
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const parsed = JSON.parse(loggedUser);
      setUser(parsed);
      setFormData({ name: parsed.name || "", email: parsed.email || "" });
    }
  }, []);

  // Theme toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", newMode);
  };

  // Notification toggle
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("notifications", newState);
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      if (!user?.id) return;
      const res = await axios.put(`http://localhost:8082/api/users/${user.id}`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile!");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
      alert("Please fill all fields!");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.put(`http://localhost:8082/api/users/${user.id}/password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      alert("Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    } catch (err) {
      alert("Failed to change password!");
    }
  };

  // Language change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Accent color
  const handleColorChange = (e) => {
    const color = e.target.value;
    setAccentColor(color);
    localStorage.setItem("accent", color);
    document.documentElement.style.setProperty("--accent-color", color);
  };

  // Clear data
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear your local data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (window.confirm("This will permanently delete your account. Continue?")) {
      try {
        await axios.delete(`http://localhost:8082/api/users/${user.id}`);
        localStorage.clear();
        alert("Account deleted successfully!");
        window.location.href = "/";
      } catch (err) {
        alert("Failed to delete account!");
      }
    }
  };

  // Handle support form submit
const handleSupportSubmit = async (e) => {
  e.preventDefault();

  if (!supportForm.subject || !supportForm.message) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Include user email if available
    const payload = {
      subject: supportForm.subject,
      message: supportForm.message,
      email: user?.email || "anonymous@user.com", // use logged-in user email if available
    };

    const res = await axios.post("http://localhost:8082/api/support", payload);

    if (res.status === 200 || res.status === 201) {
      alert("✅ Your support request has been submitted successfully!");
      setSupportForm({ subject: "", message: "" });
    } else {
      alert("❌ Failed to submit request. Please try again.");
    }
  } catch (err) {
    console.error("Error submitting support request:", err);
    alert("⚠️ Something went wrong while sending your request.");
  }
};


  // Render sections
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="settings-content">
            <h3>👤 Profile Settings</h3>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editMode}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!editMode}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {editMode ? (
              <div className="profile-buttons">
                <button className="btn-save" onClick={handleSaveProfile}><FaSave /> Save</button>
                <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn-edit" onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
          </div>
        );

      case "appearance":
        return (
          <div className="settings-content">
            <h3>🎨 Appearance</h3>
            <div className="toggle-section">
              <p>Dark Mode</p>
              <button className="toggle-btn" onClick={toggleDarkMode}>
                {darkMode ? (<><FaSun /> Light Mode</>) : (<><FaMoon /> Dark Mode</>)}
              </button>
            </div>
            
          </div>
        );

      case "notifications":
        return (
          <div className="settings-content">
            <h3>🔔 Notifications</h3>
            <div className="toggle-section">
              <p>Enable Notifications</p>
              <label className="switch">
                <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        );


      case "privacy":
        return (
          <div className="settings-content">
            <h3>🔒 Privacy & Data</h3>
            <button className="btn-save" onClick={handleClearData}><FaDatabase /> Clear Local Data</button>
            <button className="btn-cancel" onClick={handleDeleteAccount}><FaTrash /> Delete Account</button>
          </div>
        );

      case "security":
        return (
          <div className="settings-content">
            <h3>🔐 Security</h3>
            <label>Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            <label>New Password</label>
            <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
            <label>Confirm New Password</label>
            <input type="password" value={passwords.confirmPass} onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })} />
            <button className="btn-save" onClick={handlePasswordChange}>Change Password</button>
          </div>
        );

      case "support":
  return (
    <div className="settings-content">
      <h3>🧰 Support & Help</h3>
      <p>Need help? Contact our support team or report an issue below.</p>

      <form onSubmit={handleSupportSubmit} className="support-form">
        <label>Subject</label>
        <input
          type="text"
          name="subject"
          placeholder="Enter your subject"
          value={supportForm.subject}
          onChange={(e) =>
            setSupportForm({ ...supportForm, subject: e.target.value })
          }
          required
        />

        <label>Message</label>
        <textarea
          rows="4"
          name="message"
          placeholder="Describe your issue or feedback..."
          value={supportForm.message}
          onChange={(e) =>
            setSupportForm({ ...supportForm, message: e.target.value })
          }
          required
        ></textarea>

        <button className="btn-send" type="submit">
          <FaEnvelope /> Send Message
        </button>
      </form>

      
    </div>
  );



      case "about":
        return (
          <div className="settings-content">
            <h3>ℹ️ About This App</h3>
            <p><strong>App Name:</strong> BookItNow – OnlineTicket Booking System</p>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Developer:</strong> Sony & Team</p>
            <p>
              BookItNow is a full-stack movie and event ticket booking platform built using
              <strong> React.js </strong> and <strong> Spring Boot</strong>.
              It provides users a seamless experience for discovering movies, booking seats,
              and managing their reservations — with features like real-time seat selection,
              payment integration, notifications, and dark mode UI.
            </p>
            <p>
              This project demonstrates modern web app development practices,
              including RESTful APIs, Axios integration, responsive design,
              and persistent local storage for preferences.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-sidebar">
        <h4>⚙️ Settings</h4>
        <ul>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}><FaUser /> Profile</li>
          <li className={activeTab === "appearance" ? "active" : ""} onClick={() => setActiveTab("appearance")}><FaMoon /> Appearance</li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}><FaBell /> Notifications</li>
          
          <li className={activeTab === "privacy" ? "active" : ""} onClick={() => setActiveTab("privacy")}><FaDatabase /> Privacy</li>
          <li className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}><FaLock /> Security</li>
          <li className={activeTab === "support" ? "active" : ""} onClick={() => setActiveTab("support")}><FaHeadset /> Support</li>
          <li className={activeTab === "about" ? "active" : ""} onClick={() => setActiveTab("about")}><FaInfoCircle /> About</li>
        </ul>
      </div>

      <div className="settings-content-wrapper">{renderContent()}</div>
      
    </div>
    
  );
};

export default SettingsPage;
