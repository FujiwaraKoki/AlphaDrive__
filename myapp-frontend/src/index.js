//import React, {useState} from "react";
import React from "react";
//import { render } from "react-dom";
import { createRoot } from 'react-dom/client';
import CustomTimeline from "./CustomTimeline";
import "react-calendar-timeline/lib/Timeline.css";

const App = () => (
  <div>
    <CustomTimeline />
  </div>
);

//render(<App />, document.getElementById("root"));
const root = createRoot(document.getElementById("root")); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
