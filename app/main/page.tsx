"use client";

import { useState } from "react";

function Page() {
  const [clicked, setClicked] = useState(false);
  const handleClickBtn = () => {
    setClicked(true);
  };
  return (
    <>
      <button onClick={handleClickBtn}>Load Greeting</button>
      {clicked && <h2>Hi!</h2>}
    </>
  );
}

export default Page;
