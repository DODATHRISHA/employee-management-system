
package com.vcube.empportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.empportal.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Integer> {

}

