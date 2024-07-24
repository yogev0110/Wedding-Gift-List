import { useState ,useEffect} from 'react'
import './App.css';

function App() {
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    fetchContacts()
  }, [])
  
  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts")
    const data = await response.json()
    setContacts(data.contacts)
    console.log(data.contacts)
  }

  return (
      <div className="App">
        <h1>Wedding Gifts List</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Gift</th>
                  <th>Number of guests</th>
              </tr>
              {contacts.map((val, key) => {
                  return (
                      <tr key={key}>
                          <td>{val.id}</td>
                          <td>{val.firstName}</td>
                          <td>{val.lastName}</td>
                          <td>{val.gift}</td>
                          <td>{val.numberOfGuests}</td>
                          <button>Edit</button>
                          <button>Delete</button>
                      </tr>
                  )
              })}
              <button>Add</button>
          </table>
      </div>
  );
}
export default App;
