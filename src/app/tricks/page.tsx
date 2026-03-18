"use client";
import React, { useState, useEffect } from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
// import { CenteredContainer } from "@/components/layout/CenteredContainer";
import axios from "axios";
import { Difficulty } from "@/components/ui/Difficulty";


export default function Tricks() {
  const [tricksData, setTricksData] = useState([]);

  useEffect(() => {
    axios
      .get("/data/Tricks.json")
      .then((res) => {
        setTricksData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <ContentContainer>
        <h1 className="text-center text-xl font-bob text-yellow">Tricks</h1>
        <div className="background-tint">
          <div className="my-container my-table-container">
            <table className="my-table w-full">
              <thead>
                <tr>
                  <th className="font-bob">Trick</th>
                  <th className="font-bob">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {tricksData.map((trick: { name: string; videoURL: string; difficulty: number }, index: number) => (
                  <React.Fragment key={index}>
                    <tr className="">
                      <td>
                        <a
                          href={trick.videoURL}
                          target="_blank"
                          className="hover:text-[#FFEB7A] hover:underline"
                        >
                          <span className="">{trick.name}</span>
                        </a>
                      </td>
                      <td className="ext-cols"><Difficulty count={trick.difficulty} /></td>
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
