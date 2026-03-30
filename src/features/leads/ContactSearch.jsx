import React, { useState, useEffect } from 'react';

const ContactSearch = ({ contacts, onSearch, onSelect, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    if (searchInput.trim() === '') {
      setFilteredContacts(contacts.slice(0, 10)); 
      const filtered = contacts.filter(contact => {
        const fullName = contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
        return (
          fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
          (contact.email && contact.email.toLowerCase().includes(searchInput.toLowerCase())) ||
          (contact.mobile && contact.mobile.includes(searchInput))
        );
      });
      setFilteredContacts(filtered.slice(0, 20));
    }
  }, [searchInput, contacts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const handleSelect = (contact) => {
    onSelect(contact);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Search Contact</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name, email or mobile..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
          autoFocus
        />

        <div className="space-y-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelect(contact)}
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-medium">
                  {contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unnamed'}
                </div>
                <div className="text-sm text-gray-600">
                  {contact.email && <div>📧 {contact.email}</div>}
                  {contact.mobile && <div>📱 {contact.mobile}</div>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No contacts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSearch;