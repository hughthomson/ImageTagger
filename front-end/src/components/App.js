import './App.css';
import './Nav.css';
import CredentialFormatter from './CredentialFormatter';
import Upload from './Upload';
import Images from './Images';
import Subscribe from './Subscribe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Router>
        <div>
          <nav>
            <ul>
              <div className='nav-options'>
                <li>
                  <a href='/' className='title'>
                    Image Tagger
                  </a>
                </li>
                <li>
                  <a href='/'>Images</a>
                </li>
                <li>
                  <a href='/upload'>Upload</a>
                </li>
                <li>
                  <a href='/format'>Format</a>
                </li>
                <li>
                  <a href='/subscribe'>Subscribe</a>
                </li>
              </div>
            </ul>
          </nav>
          <div className='content'>
            <Routes>
              <Route path='/' element={<Images />} />
              <Route path='upload' element={<Upload />} />
              <Route path='/format' element={<CredentialFormatter />} />
              <Route path='/subscribe' element={<Subscribe />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
