import React, { useState, useEffect } from 'react';
import { LiveKitRoom, AudioConference, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import '@livekit/components-styles';
import './index.css';

function App() {
  const [livekitUrl, setLivekitUrl] = useState('');
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('राजेश जी');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Backend token server: use env var if provided, otherwise fallback to local dev server
  const TOKEN_SERVER = import.meta.env.VITE_TOKEN_SERVER || 'http://localhost:8000';
  const LIVEKIT_URL = 'wss://mywifu-vvk52760.livekit.cloud';

  const connectToMeera = async () => {
    setIsConnecting(true);
    try {
      console.log('🔄 Getting token from backend...');
      
      // Get token from your deployed backend
      const response = await fetch(`${TOKEN_SERVER}/get-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          roomName: 'meera-health-room'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.token) {
        console.log('✅ Token received, connecting to LiveKit...');
        
        const urlFromBackend = data.url || LIVEKIT_URL;
        setLivekitUrl(urlFromBackend);
        setToken(data.token);
        setIsConnected(true);
        setConnectionState('connected');
        
      } else {
        throw new Error('No token received from backend');
      }
      
    } catch (error) {
      console.error('❌ Failed to connect to Meera:', error);
      alert(`कनेक्शन में समस्या: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromMeera = () => {
    setIsConnected(false);
    setToken('');
    setLivekitUrl('');
    setConnectionState('disconnected');
    console.log('👋 Disconnected from Meera');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {};
  }, []);

  if (!isConnected) {
    return (
      <MeeraPreJoin
        onConnect={connectToMeera}
        userName={userName}
        setUserName={setUserName}
        isConnecting={isConnecting}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-fuchsia-950 to-rose-950 text-gray-100">
      <LiveKitRoom serverUrl={livekitUrl} token={token}>
        {/* Ensure remote audio tracks are rendered and autoplay is unlocked */}
        <RoomAudioRenderer />
        <div className="fixed top-4 right-4 z-50">
          <StartAudio label="Enable Audio" className="px-3 py-2 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow" />
        </div>

        <MeeraInterface
          onDisconnect={disconnectFromMeera}
          userName={userName}
          connectionState={connectionState}
        />
      </LiveKitRoom>
    </div>
  );
}

// Pre-connection screen with better UX
function MeeraPreJoin({ onConnect, userName, setUserName, isConnecting }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-950 to-rose-950 flex items-center justify-center p-4">
      <div className="bg-slate-900/60 backdrop-blur rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-white/10">
        
        {/* Meera's Avatar with Animation */}
        <div className="mb-6">
          <div className={`w-24 h-24 bg-gradient-to-r from-fuchsia-600 to-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold ${isConnecting ? 'animate-pulse' : ''}`}>
            💕
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 font-hindi">
            मीरा 
          </h1>
          <p className="text-gray-300 mt-2">आपकी Personal Health Companion</p>
        </div>

        {/* Caring Welcome Message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-fuchsia-900/40 to-rose-900/40 rounded-lg border border-white/10">
          <p className="text-lg text-gray-100 font-hindi">
            🙏 नमस्ते जी! 
          </p>
          <p className="text-sm text-gray-300 mt-1">
            मैं आपकी सेहत का ख्याल रखने के लिए यहाँ हूँ
          </p>
          <p className="text-xs text-gray-400 mt-2">
            💊 July 2025 की रिपोर्ट के साथ
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2 font-hindi">
            आपका नाम
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-fuchsia-600 focus:border-transparent font-hindi"
            placeholder="राजेश कुमार खंडेलवाल"
            disabled={isConnecting}
          />
        </div>

        {/* Health Preview Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-900/30 border border-emerald-400/30 p-3 rounded-lg">
            <div className="text-emerald-300 font-bold">Cholesterol</div>
            <div className="text-emerald-200">113 ✅ Perfect</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-400/30 p-3 rounded-lg">
            <div className="text-amber-300 font-bold">HbA1c</div>
            <div className="text-amber-200">7.1% ⚠️ Fair</div>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-400/30 p-3 rounded-lg">
            <div className="text-emerald-300 font-bold">Thyroid</div>
            <div className="text-emerald-200">Perfect ✅</div>
          </div>
          <div className="bg-sky-900/30 border border-sky-400/30 p-3 rounded-lg">
            <div className="text-sky-300 font-bold">Location</div>
            <div className="text-sky-200">Alwar 📍</div>
          </div>
        </div>

        {/* Connect Button */}
        <button
          onClick={onConnect}
          disabled={isConnecting || !userName.trim()}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 font-hindi ${
            isConnecting
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:shadow-lg transform hover:scale-105'
          } text-white`}
        >
          {isConnecting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              मीरा से जुड़ रहे हैं...
            </span>
          ) : (
            '💕 मीरा से बात करें'
          )}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          🔒 सारी health जानकारी सुरक्षित है
        </p>
      </div>
    </div>
  );
}

// Main interface with audio conversation
function MeeraInterface({ onDisconnect, userName, connectionState }) {
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-gray-100">
      
      {/* Header with Connection Status */}
      <div className="bg-gradient-to-r from-fuchsia-700 to-rose-700 text-white p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3" title={userName}>
            💕
          </div>
          <div>
            <h1 className="font-bold text-lg font-hindi">मीरा</h1>
            <p className="text-sm opacity-90">
              {connectionState === 'connected' ? '🟢 आपकी सेवा में' : '🟡 कनेक्ट हो रहे हैं...'}
            </p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-hindi"
        >
          समाप्त करें
        </button>
      </div>

      {/* Health Dashboard */}
      <div className="bg-slate-900 p-4 border-b border-white/10">
        <div className="flex space-x-4 overflow-x-auto">
          <HealthCard title="Blood Sugar" value="150 mg/dl" status="fair" />
          <HealthCard title="Cholesterol" value="113" status="good" />
          <HealthCard title="TSH" value="1.23" status="good" />
          <HealthCard title="Creatinine" value="0.97" status="good" />
        </div>
      </div>

      {/* Main Audio Interface - This is where your dad talks to Meera */}
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-32 h-32 bg-gradient-to-r from-fuchsia-600 to-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-5xl mb-6 animate-pulse shadow-lg shadow-rose-900/40">
            🎤
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-hindi">
            मीरा सुन रही हैं
          </h2>
          <p className="text-gray-300 font-hindi">
            बोलिए, आपकी health के बारे में क्या जानना है?
          </p>
          
          {/* LiveKit Audio Component */}
          <div className="mt-6">
            <AudioConference />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-slate-900 border-t border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton icon="🌤️" text="अलवर का मौसम" />
          <QuickActionButton icon="💊" text="दवाई रिमाइंडर" />
          <QuickActionButton icon="📊" text="रिपोर्ट देखें" />
          <QuickActionButton icon="❤️" text="स्वास्थ्य सुझाव" />
        </div>
      </div>
    </div>
  );
}

// Health Card Component
function HealthCard({ title, value, status }) {
  const statusColor = {
    good: 'bg-green-100 text-green-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-w-[120px] bg-white/5 border border-white/10 p-3 rounded-lg shadow-sm">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="font-bold text-sm text-white">{value}</div>
      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${statusColor[status]}`}>
        {status === 'good' ? '✅ Perfect' : status === 'fair' ? '⚠️ ठीक' : '⚠️ ध्यान दें'}
      </div>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({ icon, text }) {
  return (
    <button className="flex items-center justify-center p-3 bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
      <span className="mr-2">{icon}</span>
      <span className="text-sm font-hindi">{text}</span>
    </button>
  );
}

export default App;
