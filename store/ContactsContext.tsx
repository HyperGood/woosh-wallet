import * as Contacts from 'expo-contacts';
import { createContext, useContext, useState } from 'react';

import { storage } from '../app/_layout';

interface ContactContextType {
  phoneContacts: Contacts.Contact[] | null;
  getPhoneContacts: () => void;
  hasRequestedContacts: string | undefined;
}

const ContactContext = createContext<ContactContextType>({
  phoneContacts: null,
  getPhoneContacts: () => {},
  hasRequestedContacts: undefined,
});

export const usePhoneContacts = () => useContext(ContactContext);

interface ContactProviderProps {
  children: React.ReactNode;
}

export const ContactProvider = ({ children }: ContactProviderProps) => {
  const [phoneContacts, setContacts] = useState<any>();
  const [hasRequestedContacts, setHasRequestedContacts] = useState<string>();

  const getPhoneContacts = async () => {
    const requestedContacts = storage.getString('hasRequestedContacts');
    setHasRequestedContacts(requestedContacts);
    console.log('requestedContacts', requestedContacts);

    if (!requestedContacts || phoneContacts === undefined) {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasRequestedContacts('true');

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const contactsWithPhoneNumbers = data.filter(
          (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
        );

        if (contactsWithPhoneNumbers.length > 0) {
          setContacts(contactsWithPhoneNumbers);
          storage.set('hasRequestedContacts', 'true');
        }
      }
    }
  };

  return (
    <ContactContext.Provider value={{ phoneContacts, getPhoneContacts, hasRequestedContacts }}>
      {children}
    </ContactContext.Provider>
  );
};
