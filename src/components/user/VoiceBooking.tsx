import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mic, MicOff, Volume2, Calendar, MapPin, Trash2, CheckCircle } from 'lucide-react';

export default function VoiceBooking() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extractedData, setExtractedData] = useState({
    wasteType: '',
    weight: '',
    date: '',
    time: '',
    location: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
          processVoiceInput(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceInput = (text: string) => {
    setIsProcessing(true);
    
    // Simple keyword extraction - in real app, use NLP
    const lowerText = text.toLowerCase();
    
    // Extract waste type
    const wasteTypes = ['plastic', 'metal', 'glass', 'paper', 'organic'];
    const detectedWasteType = wasteTypes.find(type => lowerText.includes(type));
    
    // Extract weight
    const weightMatch = lowerText.match(/(\d+)\s*(kg|kilos|kilogram)/);
    const detectedWeight = weightMatch ? `${weightMatch[1]} kg` : '';
    
    // Extract date
    const dateMatch = lowerText.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
    const detectedDate = dateMatch ? dateMatch[1] : '';
    
    // Extract time
    const timeMatch = lowerText.match(/(\d+)\s*(am|pm|morning|afternoon|evening)/);
    const detectedTime = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}` : '';
    
    // Extract location
    const locationMatch = lowerText.match(/at\s+([a-zA-Z\s]+)/);
    const detectedLocation = locationMatch ? locationMatch[1].trim() : '';

    setExtractedData(prev => ({
      wasteType: detectedWasteType || prev.wasteType,
      weight: detectedWeight || prev.weight,
      date: detectedDate || prev.date,
      time: detectedTime || prev.time,
      location: detectedLocation || prev.location
    }));

    setTimeout(() => setIsProcessing(false), 1000);
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
      speak("Hi! I'm Bhoomika, your voice assistant. Tell me about your waste collection needs - what type, how much weight, when, and where?");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const confirmBooking = () => {
    const booking = {
      id: Date.now().toString(),
      userId: user?.id,
      wasteType: extractedData.wasteType,
      weight: extractedData.weight,
      date: extractedData.date,
      time: extractedData.time,
      location: extractedData.location,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user?.id}`) || '[]');
    existingBookings.push(booking);
    localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(existingBookings));

    setBookingComplete(true);
    speak("Your waste collection has been booked successfully! You will receive a confirmation shortly.");
  };

  const resetBooking = () => {
    setTranscript('');
    setExtractedData({
      wasteType: '',
      weight: '',
      date: '',
      time: '',
      location: ''
    });
    setBookingComplete(false);
  };

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Speech Recognition Not Supported</h2>
          <p className="text-red-700">Your browser doesn't support speech recognition. Please try using Chrome or Edge.</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your waste collection appointment has been scheduled successfully.</p>
          <button
            onClick={resetBooking}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Book Another Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Volume2 className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Voice Booking with Bhoomika</h1>
          </div>
          <p className="text-gray-600">Book your waste collection using voice commands</p>
        </div>

        {/* Voice Interface */}
        <div className="text-center mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`
              w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300
              ${isListening 
                ? 'bg-red-600 hover:bg-red-700 voice-pulse' 
                : 'bg-green-600 hover:bg-green-700 hover-lift'
              }
            `}
          >
            {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
          </button>
          <p className="mt-4 text-gray-600">
            {isListening ? 'Listening... Speak now' : 'Click to start voice booking'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">What you said:</h3>
            <p className="text-gray-700">{transcript}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
              <span className="text-green-600">Processing your request...</span>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Extracted Information</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Trash2 className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Waste Type</p>
                <p className="font-medium">{extractedData.wasteType || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {extractedData.date || 'Not specified'} {extractedData.time && `at ${extractedData.time}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{extractedData.location || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 bg-orange-600 rounded mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-medium">{extractedData.weight || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Voice Commands Help</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-800">Example Commands:</p>
              <ul className="text-green-700 mt-2 space-y-1">
                <li>"I want to collect 5kg of plastic bottles tomorrow at 10 AM at my home"</li>
                <li>"Book metal scrap pickup for Monday morning"</li>
                <li>"Schedule glass bottles collection today evening"</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-800">Supported Waste Types:</p>
              <p className="text-blue-700 mt-1">Plastic, Metal, Glass, Paper, Organic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Button */}
      {extractedData.wasteType && extractedData.date && (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Confirm?</h3>
          <p className="text-gray-600 mb-6">
            Booking {extractedData.wasteType} collection {extractedData.weight && `(${extractedData.weight})`} 
            for {extractedData.date} {extractedData.time && `at ${extractedData.time}`}
          </p>
          <button
            onClick={confirmBooking}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}