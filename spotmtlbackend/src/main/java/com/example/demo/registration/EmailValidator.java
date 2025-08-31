package com.example.demo.registration;
import java.util.function.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailValidator implements Predicate<String> {

    @Override
    public boolean test(String email) {
        //TODO: Regex to validate email
        return true;
    }

}
