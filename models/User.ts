export interface User {
  id: string;
  name: string;
  username: string;
  address: string;
  phone?: string;
  image?: string;
  // You can also include references to sub-collections if needed
  //Account
  //Session
  //Transaction
  //Contacts
}
