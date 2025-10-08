import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormik } from 'formik';
import axios from 'axios';

function App() {
  const [dataApi, setDataApi] = useState([]);
  const [editId, setEditId] = useState(null); // track which user to update

  useEffect(() => {
    getData();
  }, []);

  // Fetch users
  async function getData() {
    let { data } = await axios.get('https://68e5390321dd31f22cc10248.mockapi.io/users');
    setDataApi(data);
    console.log(data);
  }

  // Clear form
  function clearForm() {
    formilk.setValues({
      name: '',
      email: '',
      password: '',
      address: ''
    });
    setEditId(null);
  }

  // Post new user
  async function postdata(values) {
    await axios.post('https://68e5390321dd31f22cc10248.mockapi.io/users', values);
    clearForm();
    getData();
  }

  // Delete user
  async function deleteApi(id) {
    await axios.delete(`https://68e5390321dd31f22cc10248.mockapi.io/users/${id}`);
    getData();
  }

  // Select user for editing
  function selectUser(id) {
    let user = dataApi.find((u) => u.id === id);
    formilk.setValues({
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address
    });
    setEditId(id);
  }

  // Update user
  async function handleUpdate() {
    if (editId) {
      await axios.put(`https://68e5390321dd31f22cc10248.mockapi.io/users/${editId}`, formilk.values);
      clearForm();
      getData();
    }
  }

  // Formik setup
  const formilk = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      address: ''
    },
    onSubmit: (values) => {
      if (editId) {
        handleUpdate();
      } else {
        postdata(values);
      }
    }
  });

  return (
    <div>
      <h1 className="text-center">CRUD App With API</h1>

      <form onSubmit={formilk.handleSubmit}>
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <input onChange={formilk.handleChange} value={formilk.values.name} name="name" type="text" className="my-3 form-control" placeholder="Name" />
          <input onChange={formilk.handleChange} value={formilk.values.email} name="email" type="email" className="my-3 form-control" placeholder="Email" />
          <input onChange={formilk.handleChange} value={formilk.values.password} name="password" type="password" className="my-3 form-control" placeholder="Password" />
          <input onChange={formilk.handleChange} value={formilk.values.address} name="address" type="text" className="my-3 form-control" placeholder="Address" />

          <div className="text-center">
            <button type="submit" className={`btn ${editId ? 'btn-warning' : 'btn-success'} px-5`}>
              {editId ? 'Update' : 'Submit'}
            </button>
            <button type="button" onClick={clearForm} className="btn btn-danger ms-2 px-5">
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <div className="row mt-4 g-3">
          {dataApi.map((user) => (
            <div key={user.id} className="col-md-6 col-sm-8 col-lg-4">
              <div className="table-responsive bg-info text-white p-3 rounded shadow">
                <h5>ID: {user.id}</h5>
                <h5>Name: {user.name}</h5>
                <h5>Email: {user.email}</h5>
                <h5>Address: {user.address}</h5>
                <button onClick={() => deleteApi(user.id)} className="btn btn-danger me-2">
                  Delete
                </button>
                <button onClick={() => selectUser(user.id)} className="btn btn-warning">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;