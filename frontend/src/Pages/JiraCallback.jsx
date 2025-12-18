import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/UI_Components";

const JiraCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/settings?section=integrations");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          JIRA Connected Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Your JIRA account has been connected. You can now view JIRA issues in your Kanban boards.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/settings?section=integrations")}
        >
          Go to Settings
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default JiraCallback;


