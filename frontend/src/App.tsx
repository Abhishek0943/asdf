
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
            <div className="app">
              <Routes>
                <Route path="/*" element={<>
                  <Routes>
                    <Route path="/*" element={<>
                      <main>
                        <h1>hii</h1>
                        {/* <Routes> */}
                          {/* <Route path="/profile/*" element={<Profile />} /> */}
                        {/* </Routes> */}
                      </main>
                    </>} />
                  </Routes>
                </>} />
              </Routes>
            </div>
    </BrowserRouter>

  )
}
export default App