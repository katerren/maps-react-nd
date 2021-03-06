import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import SideMenu from './components/SideMenu';
import { getLocations, searchLoca } from './LocationsApi';
import Modal from 'react-responsive-modal';
import ErrorBoundary from './components/ErrorBoundary';
class App extends Component {
  state = {
    map: "",
    coordinates: {
      lat: 59.9473364,
      lng: 30.2685361
    },
    zoom: 12,
    locations: [],
    filteredLocations: [],
    error: "",
    menuShown: true,
    showInfoWindow: false,
    chosenMarker: {},
    markerLoca: {},
    modalOpen: false,
    setAnimation: 0
  }
  onOpenModal = (message) => {
    this.setState({ 
      error: message?message:"Something went wrong while fetching locations :( For proper info open console.",
      modalOpen: true });
  };

  onCloseModal = () => {
    this.setState({ modalOpen: false });
  };
  componentDidMount() {
    this.getAllLocations()
  }
  searchLocations = (query) => {
    searchLoca(query)
      .then(r => {
        const locations = r.response.venues;
        this.setState({
          filteredLocations: locations
        });
      })
      .catch(err => {
      console.log(err)
      this.onOpenModal()}) //handling errors with modal window
  }
  getAllLocations() {
    getLocations()
      .then(r => {
        const locations = r.response.groups[0].items;
        this.setState({
          locations: locations,
          filteredLocations: locations
        });
      })
      .catch(err => {
        
        console.log(err)
      this.onOpenModal()}) //handling errors with modal window
  }
  hideSideMenu = () => {
    this.setState(this.state.menuShown ? {
      menuShown: false
    } : {
      menuShown: true
    })
  }

  clickMarker = (marker) => {
    console.log(marker)
    this.setState({
      showInfoWindow: true,
      chosenMarker: marker,
      setAnimation: 1,
      markerLoca: marker.venue ? {
        lat: marker.venue.location.lat,
        lng: marker.venue.location.lng
      } : {
        lat: marker.location.lat,
        lng: marker.location.lng
      }
    })
  }

  clickkBox = (loca) => {
    this.setState({
      chosenMarker: loca,
      showInfoWindow: true,
      setAnimation: 1,
      markerLoca: loca.venue ? {
        lat: loca.venue.location.lat,
        lng: loca.venue.location.lng
      } : {
        lat: loca.location.lat,
        lng: loca.location.lng
      }
    })
  }

  closeInfoWindow = () => {
    this.setState({
      chosenMarker: {},
      showInfoWindow: false,
      setAnimation: 0,
      markerLoca: {}
    })
  }
  render() {
    return (
      <div className="container">
        <header>
          <div tabIndex="1" aria-label="Menu button" className="burger-menu" onClick={this.hideSideMenu} ></div>
          <div tabIndex="6" className="github-link" aria-label="Link to github" ><a href="https://github.com/katerren">GitHub</a></div>
        </header>
        <main>
          { this.state.menuShown && 
            <SideMenu 
              searchLocations={this.searchLocations}
              filteredLocations={this.state.filteredLocations}
              clickkBox={this.clickkBox}
              >
            </SideMenu> }
          <div className="map-container" aria-label="Map">
          <ErrorBoundary>
            <Map 
              center={this.state.coordinates} 
              zoom={this.state.zoom} 
              locations={this.state.filteredLocations}
              showInfoWindow={this.state.showInfoWindow}
              chosenMarker={this.state.chosenMarker}
              clickMarker={this.clickMarker}
              closeInfoWindow={this.closeInfoWindow}
              markerLoca={this.state.markerLoca}
              setAnimation={this.state.setAnimation}
              onOpenModal={this.onOpenModal}
            />  
            </ErrorBoundary>  
            <Modal 
              open={this.state.modalOpen} 
              onClose={this.onCloseModal} center>
              <h4>{this.state.error}</h4>
            </Modal>
          </div>
        </main>
      </div>
    );
  } 
}

export default App;
