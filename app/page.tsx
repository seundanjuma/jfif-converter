"use client";

import React, { useEffect, useState } from "react";
import Home from "./Home"; // your original Home component

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent server-side render

  return <Home />;
}
