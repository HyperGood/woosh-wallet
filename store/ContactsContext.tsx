import * as Contacts from 'expo-contacts';
import { createContext, useContext, useState } from 'react';

import { storage } from '../app/_layout';

interface ContactContextType {
  contacts: any;
  getContacts: () => void;
  hasRequestedContacts: string | undefined;
}

const ContactContext = createContext<ContactContextType>({
  contacts: null,
  getContacts: () => {},
  hasRequestedContacts: undefined,
});

export const useContacts = () => useContext(ContactContext);

interface ContactProviderProps {
  children: React.ReactNode;
}

export const ContactProvider = ({ children }: ContactProviderProps) => {
  const [contacts, setContacts] = useState<any>();
  const [hasRequestedContacts, setHasRequestedContacts] = useState<string>();

  const getContacts = async () => {
    const requestedContacts = storage.getString('hasRequestedContacts');
    setHasRequestedContacts(requestedContacts);
    console.log('requestedContacts', requestedContacts);

    if (!requestedContacts || contacts === undefined) {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasRequestedContacts('true');

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data);
          storage.set('hasRequestedContacts', 'true');
        }
      }
    }
  };

  return (
    <ContactContext.Provider value={{ contacts, getContacts, hasRequestedContacts }}>
      {children}
    </ContactContext.Provider>
  );
};
