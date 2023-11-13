import React from 'react';
import './App.css';
import SomeComponent from './components/SomeComponent'; // 適切なパスを指定してください

import {BrowserRouter, Router} from 'react-router-dom';

/*
function App() {
    return (
        <div className="App">
            <SomeComponent />  // ここであなたのコンポーネントを使用します
        </div>
    );
}
*/
function App() {
    return (
        <BrowserRouter>
            <h1>
                Test Browser
            </h1>
            <Route path="/"><SomeComponent /></Route>
            <Route path="/CustomTimeLine"><CustomTimeLine /></Route>
            <Route><NotFound/></Route>
        </BrowserRouter>
    );
}

function SomeComponent(){
    return (
        <div className="App">
            {/* 他のコンポーネントや要素 */}
            <SomeComponent />  // ここであなたのコンポーネントを使用します
            {/* 他のコンポーネントや要素 */}
        </div>
    );
}

function CustomTimeLine(){
    return(
        <div className="CustomTimeLine">
            <CustomTimeLine />
        </div>
    );
}

function NotFound() {
    return (
        <h2>Not Found.</h2>
    );
}

export default App;