import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/UI_Components";

const JiraError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message") || "An error occurred during JIRA connection";

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/settings?section=integrations");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          JIRA Connection Failed
        </h1>
        <p className="text-gray-600 mb-2">
          {message}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please try connecting again from Settings.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/settings?section=integrations")}
        >
          Go to Settings
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default JiraError;


