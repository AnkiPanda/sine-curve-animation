import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './SineWaveAnimation.css';

const SineWaveAnimation = () => {
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [ballState, setBallState] = useState(false);

  // Dimensions and scales
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  const xScale = d3.scaleLinear().domain([0, 720]).range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height - margin.bottom, margin.top]);

  // Path generator for the sine wave
  const sineWavePath = d3.line()
    .x(d => xScale(d))
    .y(d => yScale(Math.sin((d / 720) * 4 * Math.PI))) // Scale d to match 0-2π range
    .curve(d3.curveBasis);

  // Data array for the sine wave path
  const data = d3.range(0, 720);

  // Effect to move the point along the sine wave
  useEffect(() => {
    const interval = setInterval(() => {
      setPointPosition(prevPosition => {
        let newX = prevPosition.x + 5; // Adjust speed as needed
        if (newX > 720) {
          newX = 0; // Reset to beginning if x exceeds 720
        }
        const newY = Math.sin((newX / 720) * 4 * Math.PI); // Scale newX to match 0-2π range
        return { x: newX, y: newY };
      });
    }, 50); // Adjust interval for smoother animation

    return () => clearInterval(interval);
  }, []);

  // Effect to handle ball enlargement/reduction
  useEffect(() => {
    // Calculate the distance between point and ball
    const distance = Math.sqrt(Math.pow(xScale(pointPosition.x) - xScale(720), 2) + Math.pow(yScale(pointPosition.y) - yScale(Math.sin((720 / 720) * 4 * Math.PI)), 2));

    // Check if point touches the ball
    if (distance <= 15 && !ballState) { // Adjust the distance threshold as needed
      setBallState(true); // Enlarge ball when point touches it
      setTimeout(() => {
        setBallState(false); // Reduce ball after some time
      }, 500);
    }
  }, [pointPosition, ballState]);

  return (
    <div className='sine-wave-div'>
      <svg className="sine-wave-svg" width={width} height={height}>
        {/* Sine wave path */}
        <path
          d={sineWavePath(data)}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        {/* X axis */}
        <g transform={`translate(0, ${height - margin.bottom})`}>
          <line x1={margin.left} x2={width - margin.right} stroke="black" />
          {xScale.ticks(10).map((tickValue) => (
            <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
              <line y2="6" stroke="black" />
              <text dy="1.5em" y="9" fontSize="10" textAnchor="middle">{tickValue}</text>
            </g>
          ))}
        </g>

        {/* Y axis */}
        <g transform={`translate(${margin.left}, 0)`}>
          <line y1={margin.top} y2={height - margin.bottom} stroke="black" />
          {yScale.ticks(5).map((tickValue) => (
            <g key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
              <line x2="-6" stroke="black" />
              <text dx="-9" fontSize="10" textAnchor="end">{tickValue.toFixed(1)}</text>
            </g>
          ))}
        </g>

        {/* Point moving along the sine wave */}
        <circle
          cx={xScale(pointPosition.x)}
          cy={yScale(pointPosition.y)}
          r="5"
          fill="blue"
        />

        {/* Ball that enlarges/reduces */}
        <circle
          cx={xScale(720)} // Place ball at the end of the curve
          cy={yScale(Math.sin((720 / 720) * 4 * Math.PI))}
          r={ballState ? "20" : "10"}
          fill="red"
          className="ball-animation"
        />
      </svg>
    </div>
  );
};

export default SineWaveAnimation;
