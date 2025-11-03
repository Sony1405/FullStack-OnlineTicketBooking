package com.example.ticketbooking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="favorite")
public class Favorite {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable=false)
    private String externalId; // id of movie/event

    private String title;
    private String type;
    
    

    public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public User getUser() {
		return user;
	}



	public void setUser(User user) {
		this.user = user;
	}



	public String getExternalId() {
		return externalId;
	}



	public void setExternalId(String externalId) {
		this.externalId = externalId;
	}



	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public String getType() {
		return type;
	}



	public void setType(String type) {
		this.type = type;
	}



	@Override
	public String toString() {
		return "Favorite [id=" + id + ", user=" + user + ", externalId=" + externalId + ", title=" + title + ", type="
				+ type + "]";
	}



	public Favorite(Long id, User user, String externalId, String title, String type) {
		super();
		this.id = id;
		this.user = user;
		this.externalId = externalId;
		this.title = title;
		this.type = type;
	}



	// constructors, getters, setters
    public Favorite() {}

}
