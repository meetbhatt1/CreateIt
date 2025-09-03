import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  MultiSelect,
  RadioGroup,
} from "../components/ui/UI_Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../utils/API";
import { ArrowLeft } from "lucide-react";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectVisibility, setProjectVisibility] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [customRoles, setCustomRoles] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  console.log("------------------>>>>>>>>>>>>>>>>", user._id);

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
  });

  const [languageOptions] = useState([
    { value: "js", label: "JavaScript" },
    { value: "react", label: "ReactJs" },
    { value: "node", label: "NodeJs" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "rust", label: "Rust" },
  ]);

  useEffect(() => {
    if (memberCount > 0) {
      const newMemberInfo = [];
      for (let i = 0; i < memberCount; i++) {
        const existingMember = memberInfo.find((member) => member.id === i);
        newMemberInfo.push(
          existingMember || {
            id: i,
            userId: i === 0 ? userId : null,
            role: "",
            language: [],
          }
        );
      }
      setMemberInfo(newMemberInfo);
    } else {
      setMemberInfo([]);
    }
  }, [memberCount]);

  const handleLanguageChange = (id, selectedValues) => {
    setMemberInfo((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, language: selectedValues } : member
      )
    );
  };

  const handleMemberChange = (id, field, value) => {
    setMemberInfo((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const memberBox = () => {
    if (memberCount <= 0) return null;

    return memberInfo.map((member) => {
      const languages = Array.isArray(member.language) ? member.language : [];
      const isCurrentUser = member.id === 0;

      return (
        <div
          key={member.id}
          className="w-full border-2 border-dotted p-3.5 border-gray-400 mb-4 rounded-lg"
        >
          <p className="mb-2 font-semibold text-violet-400">
            {isCurrentUser ? "You (Creator)" : `Member ${member.id + 1}`}
          </p>

          {!isCurrentUser ? (
            <Input
              type="text"
              placeholder="User ID"
              value={member.userId || ""}
              onChange={(e) =>
                handleMemberChange(member.id, "userId", e.target.value)
              }
            />
          ) : (
            <div className="mb-4">
              <p className="font-medium">Your ID: {userId}</p>
            </div>
          )}

          <Dropdown
            label="Role"
            value={member.role}
            onChange={(e) =>
              handleMemberChange(member.id, "role", e.target.value)
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
            label={`${isCurrentUser ? "Your" : "Member"} Languages`}
          />
        </div>
      );
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!projectName.trim()) {
      newErrors.projectName = "Project name is required";
      isValid = false;
    } else if (projectName.trim().length < 3) {
      newErrors.projectName = "Name too short (min 3 characters)";
      isValid = false;
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = "Description is required";
      isValid = false;
    } else if (projectDescription.trim().length < 10) {
      newErrors.projectDescription =
        "Description too short (min 10 characters)";
      isValid = false;
    }

    if (!projectVisibility) {
      newErrors.projectVisibility = "Visibility is required";
      isValid = false;
    }

    if (memberCount < 1) {
      newErrors.memberCount = "At least 1 member is required";
      isValid = false;
    }

    // Validate member info
    for (const member of memberInfo) {
      if (!member.role || member.role === "0") {
        newErrors.memberInfo = "All members must have a role";
        isValid = false;
        break;
      }
      if (member.role === "4" && !customRoles[member.id]?.trim()) {
        newErrors.memberInfo = "Custom role is required";
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateForm()) return;

      // Prepare team data
      const teamData = {
        title: projectName.trim(),
        description: projectDescription.trim(),
        visibility: projectVisibility === "1",
        members: memberInfo.map((member) => ({
          userId: member.id === 0 ? userId : member.userId || null,
          role:
            member.role === "4"
              ? customRoles[member.id] || ""
              : roleData.find((r) => r.value === member.role)?.label,
          languages: member.language,
        })),
      };

      console.log("PARAMETERS : ", teamData);
      console.log("Token : ", localStorage.getItem("token"));
      // Create team
      const response = await axios.post(`${API}/team/team`, teamData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (response.status === 201) {
        const teamId = response.data.team._id;

        // Send invitations to other members
        const otherMembers = memberInfo.slice(1);
        await sendInvitations(teamId, otherMembers);

        navigate("/invitations");
      }
    } catch (error) {
      console.error("Team creation failed:", error);
      alert(`Team creation failed: ${error}`);
    }
  };

  const sendInvitations = async (teamId, members) => {
    const invitationPromises = members
      .filter((member) => member.userId)
      .map(async (member) => {
        try {
          const requestData = {
            userId: member.userId,
            role:
              member.role === "4"
                ? customRoles[member.id] || ""
                : roleData.find((r) => r.value === member.role)?.label,
            languages: member.language,
            sender: userId,
          };

          await axios.post(`${API}/team/${teamId}/invite`, requestData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          return true;
        } catch (err) {
          console.error(`Failed to invite ${member.userId}:`, err);
          return false;
        }
      });

    await Promise.all(invitationPromises);
  };

  return (
    <div className="min-h-screen bg-white-50">
      <Button
        variant="secondary"
        className="btn-primary flex items-center m-2 text-white transition-all"
        onClick={() => navigate("/my-team")}
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Go Back
      </Button>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-purple-700 mb-2">
              💪 Create Team Project
            </h1>
          </div>
          <div className="m-1 flex-col space-y-4">
            <Input
              type="text"
              placeholder="Project name"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              error={errors.projectName}
            />

            <Input
              type="textarea"
              placeholder="Project description"
              required
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              error={errors.projectDescription}
            />

            <RadioGroup
              label="Visibility"
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
              onChange={(e) => setMemberCount(Number(e.target.value))}
              options={[
                { value: 1, label: "Just myself" },
                { value: 2, label: "2 Members" },
                { value: 3, label: "3 Members" },
                { value: 4, label: "4 Members" },
                { value: 5, label: "5 Members" },
              ]}
              error={errors.memberCount}
            />

            {memberCount > 0 && memberBox()}

            {errors.memberInfo && (
              <p className="text-red-500 text-sm mt-2">{errors.memberInfo}</p>
            )}

            <Button
              onClick={submitForm}
              variant="primary"
              className="w-full py-3 mt-4"
            >
              Create Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
