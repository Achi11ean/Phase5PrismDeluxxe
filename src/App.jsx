import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepageNavBar/HomePage';
import NavBar from './homepageNavBar/NavBar';
import VenueList from './venues/VenueList';  
import CreateVenue from './venues/CreateVenue';  
import EventList from './events/EventList';  
import CreateEvent from './events/CreateEvent';
//comment to test git
// Import Attendee components
import AttendeeList from './attendees/AttendeeList';  
import CreateAttendee from './attendees/CreateAttendee';  

// Import Artist components
import ArtistList from './artists/ArtistList';  
import CreateArtist from './artists/CreateArtist';  

// Import Tour components
import TourList from './tours/TourList';  // Import TourList component
import CreateTour from './tours/CreateTour';  // Import CreateTour component

import SignIn from './signin/SignIn.jsx';
import SignOut from './signin/SignOut.jsx';

import './App.css'

function App() {
  return (
    <div className="App"> 
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenueList />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        
        {/* Event-related routes */}
        <Route path="/events" element={<EventList />} />  
        <Route path="/create-event" element={<CreateEvent />} />  
        
        {/* Attendee-related routes */}
        <Route path="/attendees" element={<AttendeeList />} />  
        <Route path="/create-attendee" element={<CreateAttendee />} />  

        {/* Artist-related routes */}
        <Route path="/artists" element={<ArtistList />} />  
        <Route path="/create-artist" element={<CreateArtist />} />  

        {/* Tour-related routes */}
        <Route path="/tours" element={<TourList />} />  {/* Route for TourList */}
        <Route path="/create-tour" element={<CreateTour />} />  {/* Route for CreateTour */}
        
        {/* SignIn-related routes */}
        <Route path="/signin" element={<SignIn />} /> {/* SignIn Route */}
        <Route path="/signout" element={<SignOut />} /> {/* SignOut Route */}
      </Routes>
    </div>
  )
}

export default App;