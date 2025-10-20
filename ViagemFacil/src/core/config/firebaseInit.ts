import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { auth, firestore, storage } from './firebase';

let isEmulatorConnected = false;

/**
 * Initialize Firebase emulators for development
 * This should only be called once during app initialization
 */
export const initializeFirebaseEmulators = (): void => {
  if (__DEV__ && !isEmulatorConnected) {
    try {
      // Connect to Firebase Auth emulator
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });

      // Connect to Firestore emulator
      connectFirestoreEmulator(firestore, 'localhost', 8080);

      // Connect to Storage emulator
      connectStorageEmulator(storage, 'localhost', 9199);

      isEmulatorConnected = true;
      console.log('Firebase emulators connected successfully');
    } catch (error) {
      console.warn('Firebase emulators connection failed:', error);
    }
  }
};

/**
 * Initialize Firebase services
 * Call this function at app startup
 */
export const initializeFirebase = (): void => {
  // Initialize emulators in development
  if (__DEV__) {
    initializeFirebaseEmulators();
  }

  console.log('Firebase initialized successfully');
};