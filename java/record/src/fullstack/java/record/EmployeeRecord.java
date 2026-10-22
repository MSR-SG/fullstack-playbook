package fullstack.java.record;

import java.time.LocalDate;

public record EmployeeRecord(
        long id,
        String name,
        LocalDate dateOfBirth,
        String address,
        String designation,
        long departmentId) {
}
