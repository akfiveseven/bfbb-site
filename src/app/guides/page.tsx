"use client";
import React, { useState, useEffect } from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
// import { CenteredContainer } from "@/components/layout/CenteredContainer";
import axios from "axios";
export default function Guides() {
  const [guidesData, setGuidesData] = useState([]);

  useEffect(() => {
    axios
      .get("/data/Guides.json")
      .then((res) => {
        setGuidesData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <ContentContainer>
        <h1 className="text-center text-xl font-bob text-yellow">Guides</h1>
        <div className="background-tint">
          <div className="my-container my-table-container">
            <table className="my-table w-full">
              <thead>
                <tr>
                  <th className="font-bob">Guide</th>
                  <th className="font-bob">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {guidesData.map((guide: any, index: number) => (
                  <React.Fragment key={index}>
                    <tr className="">
                      <td>
                        <a
                          href={guide.link}
                          target="_blank"
                          className="hover:text-[#FFEB7A] hover:underline"
                        >
                          <span className="">{guide.name}</span>

                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="#fff67b" className="inline-block w-[1em] h-[1em] ml-1 align-middle">
                            <path d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z" />
                          </svg>
                        </a>
                      </td>
                      <td className="ext-cols">{guide.difficulty}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentContainer>
    </>
  );
}
