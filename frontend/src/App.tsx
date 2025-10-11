
import './index.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

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
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                        </Routes>
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

const Home= ()=>{
  return (
    <>
    <Link to={"/about"}>home</Link>
    </>
  )
}
const About= ()=>{
  return (
    <>
    <Link to={"/home"}>about</Link>

    </>
  )
}