import * as Battery from 'expo-battery';        // Import Expo Battery API for battery info
import * as Brightness from 'expo-brightness';  // Import Expo Brightness API for screen brightness

// Asynchronously gets the current battery level of the device
const get_battery_level = async () => {
  const batteryLevel = await Battery.getBatteryLevelAsync(); // Returns a value between 0 and 1
  console.log('batteryLevel', batteryLevel);
  if (batteryLevel === -1) {
    // -1 means battery info is not available
    return 'Error: Device does not support retrieving the battery level.';
  }
  return batteryLevel; // Return the battery level (0-1)
};

// Changes the device's screen brightness to the specified value (0 to 1)
const change_brightness = ({ brightness }: { brightness: number }) => {
  console.log('change_brightness', brightness);
  Brightness.setSystemBrightnessAsync(brightness); // Set the system brightness
  return brightness; // Return the new brightness value
};

// Briefly flashes the screen by setting brightness to max, then to min after 200ms
const flash_screen = () => {
  Brightness.setSystemBrightnessAsync(1); // Set brightness to max
  setTimeout(() => {
    Brightness.setSystemBrightnessAsync(0); // Set brightness to min after 200ms
  }, 200);
  return 'Successfully flashed the screen.'; // Return status message
};

// Export all tools as an object for easy import/use elsewhere
const tools = {
  get_battery_level,
  change_brightness,
  flash_screen,
};

export default tools;