import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Bar from "./components/Bar.jsx";
import RoutesPath from './components/RoutesPath';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ApolloProvider } from '@apollo/client';
import Copyright  from './components/Copyright.jsx';
import client from '../src/components/apolloClient';
import { BrowserRouter as Router } from 'react-router-dom'; 
import SearchBar from './components/SearchBar.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
      <ApolloProvider client={client}>
      <RoutesPath/>
      </ApolloProvider>
      </Router>
  </React.StrictMode>
);

reportWebVitals();
