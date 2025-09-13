import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import placeholderData from "./data/placeholder.json";
import { DataProvider, dataContext } from "./context/DataContext";
import VideoCard from "./components/videoCard";

function App() {
  const [count, setCount] = useState(0);

  const data = useContext(dataContext);
  console.log(data);
  return (
    <DataProvider>
      {data.videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          description={video.description}
        />
      ))}
    </DataProvider>
  );
}

export default App;
