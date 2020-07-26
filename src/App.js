import React from 'react';
import { Helmet } from "react-helmet";

//Components
import Navigation from './components/Header';
import Footer from './components/Footer';

// SASS
import './assets/sass/Index.scss';

function App(props) {
  return (
    <div className="App">
      <Helmet title={`Photo Book | Photography Management`} />
      <div className="AppContent">
        <Navigation />
        {props.children}
        <Footer />
      </div>
    </div>
  );
}

export default App;
