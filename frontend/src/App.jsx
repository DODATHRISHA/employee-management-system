
import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [employee, setEmployee] = useState({
    ename: "",
    age: "",
    city: "",
    state: "",
    salary: "",
  });

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = () => {
    api
      .get("/getEmpList")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.log("GET ERROR:", error);
      });
  };

  const handleChange = (event) => {
    setEmployee({
      ...employee,
      [event.target.name]: event.target.value,
    });
  };

  /* VALIDATION */
  const validateForm = () => {
    const name = employee.ename.trim();
    const city = employee.city.trim();
    const state = employee.state.trim();
    const age = Number(employee.age);
    const salary = Number(employee.salary);

    if (name === "") {
      alert("Please enter employee name");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
      alert("Employee name should contain only letters");
      return false;
    }

    if (employee.age === "") {
      alert("Please enter employee age");
      return false;
    }

    if (age < 18 || age > 100) {
      alert("Age must be between 18 and 100");
      return false;
    }

    if (city === "") {
      alert("Please enter city");
      return false;
    }

    if (state === "") {
      alert("Please enter state");
      return false;
    }

    if (employee.salary === "") {
      alert("Please enter salary");
      return false;
    }

    if (salary <= 0) {
      alert("Salary must be greater than 0");
      return false;
    }

    return true;
  };

  /* ADD EMPLOYEE */
  const addEmployee = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newEmployee = {
      ename: employee.ename.trim(),
      age: Number(employee.age),
      city: employee.city.trim(),
      state: employee.state.trim(),
      salary: Number(employee.salary),
    };

    api
      .post("/createEmp", newEmployee)
      .then(() => {
        alert("Employee added successfully!");
        clearForm();
        getEmployees();
      })
      .catch((error) => {
        console.log("POST ERROR:", error);
        alert("Error adding employee");
      });
  };

  /* EDIT EMPLOYEE */
  const editEmployee = (selectedEmployee) => {
    setEditingId(selectedEmployee.eid);

    setEmployee({
      ename: selectedEmployee.ename,
      age: selectedEmployee.age,
      city: selectedEmployee.city,
      state: selectedEmployee.state,
      salary: selectedEmployee.salary,
    });

    window.location.hash = "add-employee";
  };

  /* UPDATE EMPLOYEE */
  const updateEmployee = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedEmployee = {
      ename: employee.ename.trim(),
      age: Number(employee.age),
      city: employee.city.trim(),
      state: employee.state.trim(),
      salary: Number(employee.salary),
    };

    api
      .put(`/updateEmp/${editingId}`, updatedEmployee)
      .then(() => {
        alert("Employee updated successfully!");
        setEditingId(null);
        clearForm();
        getEmployees();
      })
      .catch((error) => {
        console.log("PUT ERROR:", error);
        alert("Error updating employee");
      });
  };

  /* CLEAR FORM */
  const clearForm = () => {
    setEmployee({
      ename: "",
      age: "",
      city: "",
      state: "",
      salary: "",
    });
  };

  /* CANCEL EDIT */
  const cancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  /* DELETE EMPLOYEE */
  const deleteEmployee = (eid) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    api
      .delete(`/delEmp/${eid}`)
      .then(() => {
        alert("Employee deleted successfully!");
        getEmployees();
      })
      .catch((error) => {
        console.log("DELETE ERROR:", error);
        alert("Error deleting employee");
      });
  };

  /* SEARCH */
  const filteredEmployees = employees.filter((emp) => {
    const searchText = search.toLowerCase();

    return (
      emp.ename.toLowerCase().includes(searchText) ||
      emp.city.toLowerCase().includes(searchText) ||
      emp.state.toLowerCase().includes(searchText)
    );
  });

  /* AVERAGE SALARY */
  const averageSalary =
    employees.length === 0
      ? 0
      : Math.round(
          employees.reduce(
            (total, emp) => total + Number(emp.salary),
            0
          ) / employees.length
        );

  return (
    <div className="app-container">

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="navbar-title">
          Employee Management
        </div>

        <div className="navbar-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#add-employee">Add Employee</a>
          <a href="#employee-list">Employees</a>
        </div>
      </nav>

      {/* HEADER */}
      <h1>Employee Management System</h1>

      {/* DASHBOARD */}
      <section id="dashboard" className="dashboard">
        <h2>Dashboard</h2>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Employees</h3>
            <p>{employees.length}</p>
          </div>

          <div className="dashboard-card">
            <h3>Average Salary</h3>
            <p>₹{averageSalary}</p>
          </div>

        </div>
      </section>

      {/* ADD / EDIT EMPLOYEE */}
      <section id="add-employee">
        <h2>
          {editingId === null ? "Add Employee" : "Edit Employee"}
        </h2>

        <form
          onSubmit={
            editingId === null ? addEmployee : updateEmployee
          }
        >

          <div className="form-group">
            <label>Employee Name</label>

            <input
              type="text"
              name="ename"
              placeholder="Enter employee name"
              value={employee.ename}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={employee.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={employee.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={employee.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary</label>

            <input
              type="number"
              name="salary"
              placeholder="Enter salary"
              value={employee.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">

            <button className="add-button" type="submit">
              {editingId === null
                ? "Add Employee"
                : "Update Employee"}
            </button>

            {editingId !== null && (
              <button
                className="cancel-button"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </section>

      {/* EMPLOYEE LIST */}
      <section id="employee-list">
        <h2>Employee List</h2>

        <input
          className="search-box"
          type="text"
          placeholder="Search by name, city or state"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {filteredEmployees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>State</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.eid}>
                  <td>{emp.eid}</td>
                  <td>{emp.ename}</td>
                  <td>{emp.age}</td>
                  <td>{emp.city}</td>
                  <td>{emp.state}</td>
                  <td>₹{emp.salary}</td>

                  <td>

                    <button
                      className="edit-button"
                      onClick={() => editEmployee(emp)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteEmployee(emp.eid)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}

export default App;