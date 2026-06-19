package hospital_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class QueueStatus {

    @Id
    private Long id = 1L;

    private Integer currentToken = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCurrentToken() {
        return currentToken;
    }

    public void setCurrentToken(
            Integer currentToken) {

        this.currentToken =
                currentToken;
    }
}