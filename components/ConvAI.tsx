'use dom'; // (Possibly a typo, should be 'use client' or similar for React server/client components)

import { useConversation } from '@elevenlabs/react'; // Custom hook for managing conversation state with the ElevenLabs agent
import { Mic } from 'lucide-react-native'; // Microphone icon component
import { useCallback } from 'react'; // React hook for memoizing functions
import { View, Pressable, StyleSheet } from 'react-native'; // React Native UI components

import tools from '../utils/tools'; // Import custom utility functions

// Function to request microphone permission (works only in web, not React Native)
async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true }); // Request audio permission
    return true;
  } catch (error) {
    console.log(error);
    console.error('Microphone permission denied');
    return false;
  }
}

// Main component for the conversational AI button
export default function ConvAiDOMComponent({
  platform, // Platform string (e.g., 'ios', 'android', 'web')
  get_battery_level, // Tool: function to get battery level
  change_brightness, // Tool: function to change brightness
  flash_screen, // Tool: function to flash the screen
}: {
  dom?: import('expo/dom').DOMProps; // (Optional) DOM props for Expo web
  platform: string;
  get_battery_level: typeof tools.get_battery_level;
  change_brightness: typeof tools.change_brightness;
  flash_screen: typeof tools.flash_screen;
}) {
  // Initialize conversation state and event handlers
  const conversation = useConversation({
    onConnect: () => console.log('Connected'), // Called when connected
    onDisconnect: () => console.log('Disconnected'), // Called when disconnected
    onMessage: (message) => {
      console.log(message); // Called on new message
    },
    onError: (error) => console.error('Error:', error), // Called on error
  });

  // Function to start the conversation session
  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission before starting
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert('No permission');
        return;
      }
      // Start the conversation session with agent and tools
      await conversation.startSession({
        agentId: 'agent_01jyjnt7hjfa1ag325mj6tt1n3', // Your agent's ID
        dynamicVariables: {
          platform, // Pass platform info
        },
        clientTools: {
          get_battery_level,
          change_brightness,
          flash_screen,
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  // Function to stop the conversation session
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Render a pressable button that starts/stops the conversation
  return (
    <Pressable
      style={[
        styles.callButton,
        conversation.status === 'connected' && styles.callButtonActive, // Change style if connected
      ]}
      onPress={
        conversation.status === 'disconnected'
          ? startConversation // Start if disconnected
          : stopConversation // Stop if connected
      }
    >
    
      <View
        style={[
          styles.buttonInner,
          conversation.status === 'connected' && styles.buttonInnerActive, // Change style if connected
        ]}
      >
        <Mic size={32} color="#E2E8F0" strokeWidth={1.5} style={styles.buttonIcon} /> {/* Microphone icon */}
      </View>
    </Pressable>
  );
}

// Styles for the button and icon
const styles = StyleSheet.create({
  callButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  callButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red tint when active
  },
  buttonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6', // Blue background
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: '#EF4444', // Red background when active
    shadowColor: '#EF4444',
  },
  buttonIcon: {
    transform: [{ translateY: 2 }], // Slightly move icon down
  },
});