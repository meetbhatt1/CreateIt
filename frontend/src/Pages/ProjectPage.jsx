import React from "react";
import { useState } from "react";

const ProjectPage = () => {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-purple-600 mb-2">
            💪 Create New Project
          </h1>
        </div>
        <div className="m-1 flex-col">
          <input
            className="input"
            type="text"
            name="project_name"
            placeholder="Enter Project Name "
            required
            // defaultValue={}
            // onChange={}
          />
          <input
            className="input"
            type="text"
            name="project_description"
            placeholder="Enter Description"
            aria-multiline
            required
            // defaultValue={}
            // onChange={}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
