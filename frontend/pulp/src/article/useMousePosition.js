import { useState, useEffect } from "react";

function getMousePosition(event) {
  console.log(event);
  if (event === undefined) {
    return {
      x: 0,
      y: 0,
    };
  }
  // const { y: y, x: x } = event;
  let y = event.y;
  let x = event.x;
  return {
    x,
    y,
  };
}

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState(getMousePosition());

  useEffect(() => {
    function handleMove(event) {
      setMousePosition(getMousePosition(event));
    }

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return mousePosition;
}
