import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import RepositoryList from './components/RepositoryList';
import RepositoryView from './components/RepositoryView';
import DocumentationView from './components/DocumentationView';
import PostmanView from './components/PostmanView';
import GraphQLView from './components/GraphQLView';
import APIExplorerView from './components/APIExplorerView';
import RepositorySync from './components/RepositorySync';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="/repository/:repoName" element={<RepositoryView />} />
            <Route path="/docs/:repoName" element={<DocumentationView />} />
            <Route path="/postman/:repoName" element={<PostmanView />} />
            <Route path="/graphql/:repoName" element={<GraphQLView />} />
            <Route path="/api-explorer/:repoName" element={<APIExplorerView />} />
            <Route path="/sync" element={<RepositorySync />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
