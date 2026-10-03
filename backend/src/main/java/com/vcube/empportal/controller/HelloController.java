
package com.vcube.empportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.empportal.model.Employee;
import com.vcube.empportal.repo.EmployeeRepo;

@CrossOrigin
@RestController
public class HelloController {

    @Autowired
    EmployeeRepo employeeRepo;

    @RequestMapping("/hello")
    String hello() {
        return "spring boot is comedy";
    }

    @GetMapping("/getEmpList")
    List<Employee> getAllEmployeeDetails() {
        return employeeRepo.findAll();
    }
    
//    http://localhost:4994/getEmp/3
    @GetMapping("/getEmp/{eid}")
    Employee getEmployee(@PathVariable int eid){
    	return employeeRepo.findById(eid).orElseThrow();
    }
    
//    http://localhost:4994/createEmp
    @PostMapping("/createEmp")
    Employee createEmployee(@RequestBody Employee employee){
    	return employeeRepo .save(employee);
    }
    
    @PutMapping("/updateEmp/{eid}")
    Employee updateEmployee(@RequestBody Employee employee, @PathVariable Integer eid) {

        Employee emFromDb = getEmployee(eid);

        emFromDb.setAge(employee.getAge());
        emFromDb.setCity(employee.getCity());
        emFromDb.setEname(employee.getEname());
        emFromDb.setSalary(employee.getSalary());
        emFromDb.setState(employee.getState());

        return employeeRepo.save(emFromDb);
    }
    
    
    @DeleteMapping("/delEmp/{eid}")
    String deleteEmployee(@PathVariable int eid){
    	employeeRepo.deleteById(eid);
    	return"Employee has been deleted success fully with id of!!" +eid;
    	
    }
}
