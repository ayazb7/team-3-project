import React, { useEffect, useState } from "react";
import axios from "axios";

const BotRender = () => {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState(null);
  const handleChange = (e) => {
    setPrompt(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted prompt:", prompt);

    try {
      const response = await axios.post("http://localhost:5000/chat/generate", {
        prompt,
      });
      setData(response.data.response);
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting prompt:", error);
    }
  };

  useEffect(() => {}, [prompt]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      onSubmit={onSubmit}
    >
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md flex flex-row gap-4">
        <label for="prompt">Enter Your Prompt:</label>
        <input type="text" name="prompt" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {data && (
        <div
          dangerouslySetInnerHTML={{ __html: data }}
          className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md"
        ></div>
      )}
    </div>
  );
};

export default BotRender;
