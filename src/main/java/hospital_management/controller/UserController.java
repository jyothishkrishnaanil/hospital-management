package hospital_management.controller;

import hospital_management.entity.User;
import hospital_management.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody User loginUser
    ) {

        User user = userRepository
                .findByUsername(
                        loginUser.getUsername()
                )
                .orElse(null);

        Map<String, String> response =
                new HashMap<>();

        if (user == null) {

            response.put(
                    "message",
                    "User not found"
            );

            return response;
        }

        if (!user.getPassword().equals(
                loginUser.getPassword()
        )) {

            response.put(
                    "message",
                    "Invalid password"
            );

            return response;
        }

        response.put(
                "message",
                "Login Successful"
        );

        response.put(
                "role",
                user.getRole()
        );

        return response;
    }
}