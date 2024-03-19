import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface User {
  id: string;
  name: string;
  username: string;
  ethAddress: string;
  phone?: string;
  image?: string;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  // You can also include references to sub-collections if needed
  //Account
  //Session
  //Transaction
  //Contacts
}
