import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TourList.css"; // Import your CSS file

function TourList() {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // For searching events
  const [venueSearchTerm, setVenueSearchTerm] = useState(""); // For searching venues
  const [artistSearchTerm, setArtistSearchTerm] = useState(""); // For searching artists
  const [editingTourId, setEditingTourId] = useState(null); // Track the tour being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    social_media_handles: "",
    event_ids: [], // For linking to events
    created_by_id: null, // For venue
    created_by_artist_id: null, // For artist
  });
  const [events, setEvents] = useState([]); // For holding events
  const [venues, setVenues] = useState([]); // For holding venues
  const [artists, setArtists] = useState([]); // For holding artists
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Fetch tours, events, venues, and artists from the backend
  useEffect(() => {
    const url = searchTerm
      ? `http://127.0.0.1:5001/tours/search?query=${searchTerm}`
      : "http://127.0.0.1:5001/tours";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tours");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage("No tours found matching your search.");
        } else {
          setErrorMessage(""); // Clear error message if tours are found
          setTours(data); // Update the tours list
        }
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        console.error("Error fetching tours:", error);
      });

    // Fetch available events for selection
    fetch("http://127.0.0.1:5001/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch venues and artists
    fetch("http://127.0.0.1:5001/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));

    fetch("http://127.0.0.1:5001/artists")
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error("Error fetching artists:", error));
  }, [searchTerm]);

  // Handle the edit button click to edit a tour
  const handleEditClick = (tour) => {
    setEditingTourId(tour.id);
    setEditFormData({
      name: tour.name,
      start_date: tour.start_date,
      end_date: tour.end_date,
      description: tour.description,
      social_media_handles: tour.social_media_handles,
      event_ids: tour.events.map((event) => event.id), // Assuming you want the IDs for updating
      created_by_id: tour.created_by_id, // For venue
      created_by_artist_id: tour.created_by_artist_id, // For artist
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save the updated tour data
  const handleSaveClick = (tourId) => {
    const updatedFormData = {
      name: editFormData.name,
      start_date: editFormData.start_date,
      end_date: editFormData.end_date,
      description: editFormData.description,
      social_media_handles: editFormData.social_media_handles,
      event_ids: editFormData.event_ids.map(Number), // Convert to numbers
      created_by_id: editFormData.created_by_id,
      created_by_artist_id: editFormData.created_by_artist_id,
    };

    fetch(`http://127.0.0.1:5001/tours/${tourId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData), // Send the updated form data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update tour");
        }
        return response.json();
      })
      .then((updatedTour) => {
        setTours(
          tours.map((tour) => (tour.id === tourId ? updatedTour : tour))
        );
        setEditingTourId(null); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating tour:", error);
        alert("Failed to update tour");
      });
  };

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditingTourId(null);
  };

  // Handle deleting a tour
  const handleDeleteClick = (tourId) => {
    fetch(`http://127.0.0.1:5001/tours/${tourId}`, {
      method: "DELETE",
    })
      .then(() => {
        setTours(tours.filter((tour) => tour.id !== tourId));
      })
      .catch((error) => console.error("Error deleting tour:", error));
  };

  return (
    <div className="tour-list-container">
      <h2>Tour List</h2>
      {/* Create button */}
      <button className="CreateTour" onClick={() => navigate("/create-tour")}>
        Create New Tour
      </button>
      {/* Search input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by tour name, artist, or venue"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {errorMessage && (
        <p
          className="error-message"
          style={{ color: "black", fontSize: "2em", backgroundColor: "white" }}
        >
          {errorMessage}
        </p>
      )}
      <table border="1" cellPadding="10" className="tour-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            <th>Social Media Handles</th>
            <th>Events</th> {/* New column for Events */}
            <th>Created By</th> {/* New column for Created By */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id}>
              {editingTourId === tour.id ? (
                <>
                  <td>{tour.id}</td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="date"
                      name="start_date"
                      value={editFormData.start_date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="date"
                      name="end_date"
                      value={editFormData.end_date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="social_media_handles"
                      value={editFormData.social_media_handles}
                      onChange={handleEditChange}
                      placeholder="e.g. twitter.com/yourhandle"
                    />
                  </td>
                  <td>
                    <input
                      className="searchedit"
                      type="text"
                      placeholder="Search Events"
                      value={eventSearchTerm}
                      onChange={(e) => setEventSearchTerm(e.target.value)}
                    />
                    <div className="event-checkboxes">
                      {events
                        .filter(event =>
                          event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
                        )
                        .map((event) => (
                          <div key={event.id}>
                            <input
                              type="checkbox"
                              id={`event-${event.id}`}
                              value={event.id}
                              checked={editFormData.event_ids.includes(event.id)}
                              onChange={(e) => {
                                const selectedEventId = parseInt(e.target.value);
                                const updatedEventIds = editFormData.event_ids.includes(selectedEventId)
                                  ? editFormData.event_ids.filter(id => id !== selectedEventId) // Uncheck the box
                                  : [...editFormData.event_ids, selectedEventId]; // Check the box

                                setEditFormData({ ...editFormData, event_ids: updatedEventIds });
                              }}
                            />
                            <label htmlFor={`event-${event.id}`}>{event.name}</label>
                          </div>
                        ))}
                    </div>
                  </td>
                  <td>
                    {/* Search input for venues */}
                    <input
                      placeholder="search for venues"
                      type="text"
                      value={venueSearchTerm}
                      onChange={(e) => setVenueSearchTerm(e.target.value)}
                      className="searchedit"
                    />
                    {/* Select for Venue */}
                    <select
                      className="SelectArtist"
                      name="created_by_id"
                      value={editFormData.created_by_id || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Venue</option>
                      {venues
                        .filter(venue =>
                          venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase())
                        )
                        .map((venue) => (
                          <option key={venue.id} value={venue.id}>
                            {venue.name}
                          </option>
                        ))}
                    </select>
                    <br />
                    {/* Search input for artists */}
                    <input
                      type="text"
                      placeholder="Search Artists"
                      value={artistSearchTerm}
                      onChange={(e) => setArtistSearchTerm(e.target.value)}
                      className="searchedit"
                    />
                    {/* Select for Artist */}
                    <select
                      className="SelectArtist"
                      name="created_by_artist_id"
                      value={editFormData.created_by_artist_id || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Artist</option>
                      {artists
                        .filter(artist =>
                          artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
                        )
                        .map((artist) => (
                          <option key={artist.id} value={artist.id}>
                            {artist.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="Saveme"
                      onClick={() => handleSaveClick(tour.id)}
                    >
                      Save
                    </button>
                    <button className="Cancelme" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{tour.id}</td>
                  <td>{tour.name}</td>
                  <td>{tour.start_date}</td>
                  <td>{tour.end_date}</td>
                  <td>{tour.description}</td>
                  <td>{tour.social_media_handles}</td>
                  <td>
                    {tour.events
                      ? tour.events.map((event) => event.name).join(", ")
                      : "No Events"}
                  </td>
                  <td>
                    {tour.created_by ? tour.created_by : tour.created_by_artist}
                  </td> {/* Show either venue or artist name */}
                  <td>
                    <button
                      className="editbutton"
                      onClick={() => handleEditClick(tour)}
                    >
                      Edit
                    </button>
                    <button
                      className="deletebutton"
                      onClick={() => handleDeleteClick(tour.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TourList;