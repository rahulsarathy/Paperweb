import { useState, useEffect } from "react";

function getWindowDimensions() {
  const {
    innerWidth: width,
    innerHeight: height,
    pageYOffset: offset,
  } = window;

  var body = document.body,
    html = document.documentElement;
  var total = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  return {
    width,
    height,
    offset,
    total,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);

    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, []);

  return windowDimensions;
}
