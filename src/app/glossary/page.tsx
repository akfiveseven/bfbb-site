"use client";
import React, { useState, useEffect } from "react";
import { ContentContainer } from "@/components/layout/ContentContainer";
// import { CenteredContainer } from "@/components/layout/CenteredContainer";
import axios from "axios";


export default function Glossary() {
  const [glossaryData, setGlossaryData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/data/glossary")
      .then((res) => {
        setGlossaryData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <ContentContainer>
        <h1 className="text-center text-xl font-bob text-yellow">Glossary</h1>
        <div className="background-tint">
          <div className="my-container my-table-container">
            <table className="my-table w-full">
              <thead>
                <tr>
                  <th className="font-bob">Term</th>
                  <th className="font-bob">Definition</th>
                </tr>
              </thead>
              <tbody>
                {glossaryData.map((term: { name: string; description: string }, index: number) => (
                  <React.Fragment key={index}>
                    <tr className="">
                      <td>
                          <span className="">{term.name}</span>
                      </td>
                      <td className="ext-cols">{term.description}</td>
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
