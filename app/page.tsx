"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [typedRoast, setTypedRoast] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("upload something first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/roast", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  // 🎯 score animation
  useEffect(() => {
    if (result?.score) {
      let start = 0;
      const interval = setInterval(() => {
        start += 0.1;
        if (start >= result.score) {
          start = result.score;
          clearInterval(interval);
        }
        setDisplayScore(Number(start.toFixed(1)));
      }, 20);
    }
  }, [result]);

  // 🔥 typing effect
  useEffect(() => {
    if (result?.roast) {
      let i = 0;
      setTypedRoast("");
      const interval = setInterval(() => {
        setTypedRoast((prev) => prev + result.roast[i]);
        i++;
        if (i >= result.roast.length) clearInterval(interval);
      }, 12);
    }
  }, [result]);

  // 🎨 dynamic color
  const getColor = () => {
    if (!result) return "#888";
    if (result.score < 4) return "#ff3b3b";
    if (result.score < 7) return "#ff9f1c";
    return "#22c55e";
  };

  // 🧠 verdict logic
  const getVerdict = () => {
    if (!result?.score) return "";

    if (result.score >= 8)
      return "are you getting that job: hell yeah";

    if (result.score >= 7)
      return "are you getting that job: you can maybe idk";

    return "are you getting that job: hell naw";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[600px] h-[600px] bg-red-500/10 blur-3xl top-[-150px] left-[-150px] animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-500/10 blur-3xl bottom-[-150px] right-[-150px] animate-pulse"></div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto space-y-6">

        <h1 className="text-5xl font-black tracking-tight text-center">
          isyourresume
          <span className="text-red-500">poopy?</span>
        </h1>

        {/* upload */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-xl hover:border-white/30 transition">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <br />
          <button
            onClick={handleUpload}
            className="px-6 py-2 rounded-lg bg-white text-black hover:scale-105 active:scale-95 transition"
          >
            {loading ? "analyzing..." : "analyze resume"}
          </button>
        </div>

        {result && (
          <div className="grid gap-6">

            {/* score */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
              <h2 className="text-sm uppercase tracking-widest text-gray-400">
                score
              </h2>

              <div
                className="text-5xl font-bold mt-2"
                style={{ color: getColor() }}
              >
                {displayScore}/10
              </div>

              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${displayScore * 10}%`,
                    backgroundColor: getColor(),
                  }}
                />
              </div>
            </div>

            {/* verdict */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                verdict
              </h2>
              <div
                className="text-2xl font-bold"
                style={{ color: getColor() }}
              >
                {getVerdict()}
              </div>
            </div>

            {/* roast */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-3">
                honest review
              </h2>
              <p className="font-mono text-sm whitespace-pre-line">
                {typedRoast}
              </p>
            </div>

            {/* suggestions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-3">
                improvements
              </h2>
              <ul className="space-y-2">
                {result.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm hover:translate-x-2 transition">
                    → {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* graph */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                weak points
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.sections}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#222" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar
                    dataKey="rejection"
                    fill={getColor()}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}