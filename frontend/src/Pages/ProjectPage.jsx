import React, { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  MultiSelect,
  RadioGroup,
} from "../components/ui/UI_Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectVisibility, setProjectVisibility] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [customRoles, setCustomRoles] = useState({});

  const [memberInfo, setMemberInfo] = useState([
    { id: 0, userId: null, role: "", language: [] },
  ]);

  const [roleData, setRoleData] = useState([
    { value: "0", label: "Select Role" },
    { value: "1", label: "Frontend Dev" },
    { value: "2", label: "Backend Dev" },
    { value: "3", label: "Designer" },
    { value: "4", label: "Others" },
  ]);

  const [errors, setErrors] = useState({
    projectName: "",
    projectDescription: "",
    projectVisibility: "",
    memberCount: "",
    memberInfo: "",
  });
  const [languageOptions] = useState([
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "rust", label: "Rust" },
  ]);

  const handleLanguageChange = (id, selectedValues) => {
    setMemberInfo((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, language: selectedValues } : member
      )
    );
  };

  useEffect(() => {
    if (memberCount > 0) {
      const newMemberInfo = [];
      for (let i = 1; i <= memberCount; i++) {
        const existingMember = memberInfo.find((member) => member.id === i);
        newMemberInfo.push(
          existingMember || { id: i, userId: "", role: 0, language: [] }
        );
      }
      setMemberInfo(newMemberInfo);
    } else {
      setMemberInfo([]);
    }
  }, [memberCount]);

  const handleMemberChange = (id, field, value) => {
    setMemberInfo((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );

    // Clear error when user makes changes
    if (errors.memberInfo[id]) {
      setErrors((prev) => ({
        ...prev,
        memberInfo: prev.memberInfo.map((error, idx) =>
          idx === id ? "" : error
        ),
      }));
    }
  };

  const memberBox = () => {
    if (memberCount <= 0) return null;

    return memberInfo.map((member) => {
      const languages = Array.isArray(member.language) ? member.language : [];
      return (
        <div
          key={member.id}
          className="w-full border-2 border-dotted p-3.5 border-gray-400 mb-4 rounded-lg"
        >
          <p className="mb-2 font-semibold text-violet-400">
            Member {member.id} {member.id === 1 && "(Including You)"}
          </p>

          <Input
            type="text"
            placeholder={`Member ${member.id} UserID (optional)`}
            value={
              member.id === 1
                ? `${localStorage.getItem("userId")}`
                : member.userId
            }
            onChange={(e) =>
              handleMemberChange(member.id, "userId", e.target.value)
            }
          />

          <Dropdown
            label={`Member ${member.id} Role`}
            value={member.role}
            onChange={(value) =>
              handleMemberChange(member.id, "role", value.target.value)
            }
            options={roleData}
          />

          {member.role === "4" && (
            <Input
              placeholder="Specify custom role"
              value={customRoles[member.id] || ""}
              onChange={(e) =>
                setCustomRoles((prev) => ({
                  ...prev,
                  [member.id]: e.target.value,
                }))
              }
            />
          )}
          <MultiSelect
            options={languageOptions}
            selectedValues={languages}
            onChange={(selected) => handleLanguageChange(member.id, selected)}
            label={`${
              member.id === 1 ? "Your" : `Member ${member.id}`
            } Languages`}
          />
        </div>
      );
    });
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Project Name validation
    if (!projectName.trim()) {
      newErrors.projectName = "Don't Even know Your own Project Title??";
      isValid = false;
    } else if (projectName.trim().length < 3) {
      newErrors.projectName =
        "Short Name For a Project (at least 3 characters)";
      isValid = false;
    }

    // Project Description validation
    const desc = String(projectDescription || ""); // Ensure it's a string
    if (!desc.trim()) {
      newErrors.projectDescription = "Please describe your project";
      isValid = false;
    } else if (desc.trim().length < 10) {
      newErrors.projectDescription =
        "Description needs more details (min 10 chars)";
      isValid = false;
    }

    // Visibility validation
    if (!projectVisibility) {
      newErrors.projectVisibility = "Please select visibility";
      isValid = false;
    }

    // Member Count validation
    if (!memberCount || memberCount === "0") {
      newErrors.memberCount = "There Is No Lone Wolf In Team Project!!!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateForm()) return null;

      // Create clean member data
      const members = memberInfo.map((member) => ({
        userId: member.userId || null,
        role: member.role === "4" ? customRoles[member.id] || "" : member.role,
        languages: Array.isArray(member.language) ? member.language : [],
      }));

      const teamData = {
        title: projectName.trim(),
        description: projectDescription.trim(),
        visibility: projectVisibility,
        members,
      };

      const response = await axios.post(
        "http://localhost:8000/api/team/team",
        teamData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status == "201") {
        console.log("Team created:", response.data);
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Error creating team:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-purple-600 mb-2">
            💪 Create Team Project
          </h1>
        </div>
        <div className="m-1 flex-col">
          <Input
            type="text"
            placeholder="Enter your projectname"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            error={errors.projectName}
          />
          <Input
            type="textarea"
            name="projectDescription"
            placeholder="Enter Description"
            required
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            error={errors.projectDescription}
          />
          <RadioGroup
            name="Visibility"
            label="Select Visibility"
            orientation="horizontal"
            selectedValue={projectVisibility}
            onChange={(e) => setProjectVisibility(e.target.value)}
            options={[
              { value: "1", label: "Public" },
              { value: "0", label: "Private" },
            ]}
            error={errors.projectVisibility}
          />
          <Dropdown
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
            options={[
              { value: "0", label: "Select No. Of Members" },
              { value: "1", label: "Yourself" },
              { value: "2", label: "2 Members" },
              { value: "3", label: "3 Members" },
              { value: "4", label: "4 Members" },
            ]}
            error={errors.memberCount}
          />
          {memberCount > 0 && memberBox()}
          <Button onClick={submitForm} variant="primary">
            <p>Submit</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
