import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [showInputFields, setShowInputFields] = useState(false);
  const [editContactId, setEditContactId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gift: '',
    numberOfGuests: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
    console.log(data.contacts);
  };

  const addContact = () => {
    setShowInputFields(true);
    setEditContactId(null);
    setFormData({
      firstName: '',
      lastName: '',
      gift: '',
      numberOfGuests: ''
    });
  };

  const handleEditClick = (contact) => {
    setEditContactId(contact.id);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      gift: contact.gift,
      numberOfGuests: contact.numberOfGuests
    });
    setShowInputFields(false); // Ensure add form is hidden when editing
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editContactId !== null) {
      // Update existing contact
      const response = await fetch(`http://127.0.0.1:5000/update_contact/${editContactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditContactId(null);
        setFormData({
          firstName: '',
          lastName: '',
          gift: '',
          numberOfGuests: ''
        });
        fetchContacts(); // Refresh the contact list
      } else {
        console.error('Failed to update contact');
      }
    } else {
      // Create new contact
      const response = await fetch("http://127.0.0.1:5000/create_contact", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowInputFields(false);
        setFormData({
          firstName: '',
          lastName: '',
          gift: '',
          numberOfGuests: ''
        });
        fetchContacts(); // Refresh the contact list
      } else {
        console.error('Failed to create contact');
      }
    }
  };

  const handleCancelClick = () => {
    setEditContactId(null);
    setShowInputFields(false);
    setFormData({
      firstName: '',
      lastName: '',
      gift: '',
      numberOfGuests: ''
    });
  };

  return (
    <div className="App">
      <h1>Wedding Gifts List</h1>
      
      <button type="button" id="add_btn_gifts_list" className="btn_gifts_list" onClick={addContact}>
        <span>Add</span>
      </button>

      {showInputFields && (
        <form onSubmit={handleSubmit} id="inputFields">
          <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
          <input type="text" name="gift" placeholder="Gift" value={formData.gift} onChange={handleChange} />
          <input type="text" name="numberOfGuests" placeholder="Number of guests" value={formData.numberOfGuests} onChange={handleChange} />
          <button type="submit" className="btn_gifts_list">Submit</button>
          <button type="button" onClick={handleCancelClick} className="btn_gifts_list">Cancel</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Gift</th>
            <th>Number of guests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((val, key) => (
            <tr key={key}>
              <td>{val.id}</td>
              <td>
                {editContactId === val.id ? (
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                ) : (
                  val.firstName
                )}
              </td>
              <td>
                {editContactId === val.id ? (
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                ) : (
                  val.lastName
                )}
              </td>
              <td>
                {editContactId === val.id ? (
                  <input type="text" name="gift" value={formData.gift} onChange={handleChange} />
                ) : (
                  val.gift
                )}
              </td>
              <td>
                {editContactId === val.id ? (
                  <input type="text" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} />
                ) : (
                  val.numberOfGuests
                )}
              </td>
              <td>
                {editContactId === val.id ? (
                  <>
                    <button type="button" onClick={handleSubmit} className="btn_gifts_list">Save</button>
                    <button type="button" onClick={handleCancelClick} className="btn_gifts_list">Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => handleEditClick(val)} className="btn_gifts_list">Edit</button>
                    <button type="button" id="delete_btn_gifts_list" className="btn_gifts_list">
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
