import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/UI_Components";
import API from "../../utils/API";

export const InviteNotification = ({ notification }) => {
  return (
    <div className="container justify-self-center my-2 bg-gradient-to-r from-blue-100 via-violet-100 to-indigo-100 rounded-2xl p-4 shadow-md font-comic mb-4 border border-indigo-200">
      <div className="flex justify-between mb-2">
        <span className="font-bold text-indigo-700">
          ✅ Team Access Request
        </span>
        {/* <span className="text-sm text-gray-500">{notification.timestamp}</span> */}
      </div>
      <p className="text-sm text-indigo-800">
        Your request to join{" "}
        <span className="font-semibold text-purple-700">
          {notification.teamName}
        </span>{" "}
        was{" "}
        <span className="font-bold text-green-500">{notification.status}</span>
      </p>
    </div>
    // <div className="container justify-self-center bg-gradient-to-r from-blue-100 via-violet-100 to-indigo-100 rounded-2xl p-4 shadow-md font-comic mb-4 border border-indigo-200">
    //   <div className="flex justify-between mb-2">
    //     <span className="font-bold text-indigo-700">
    //       ✅ Team Access Request
    //     </span>
    //     <span className="text-sm text-gray-500">2h ago</span>
    //   </div>
    //   <p className="text-sm text-indigo-800">
    //     Your request to join{" "}
    //     <span className="font-semibold text-purple-700">BuildSync Team</span>{" "}
    //     was <span className="font-bold text-green-500">Approved</span>.
    //   </p>
    // </div>
  );
};
export const InviteRequest = ({ request, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleResponse = async (accepted) => {
    setLoading(true);
    try {
      await axios.post(
        `${API}/team/invite/${request._id}/respond`,
        { accepted },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onUpdate(request._id, accepted ? "Approved" : "Rejected");
    } catch (error) {
      console.error("Error responding to invite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container justify-self-center bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 rounded-2xl p-4 shadow-sm border border-indigo-200 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">
            {request.senderName?.charAt(0) || "T"}
          </div>
          <div>
            <p className="font-semibold text-indigo-800">
              {request.senderName || "Team Owner"}
            </p>
            <p className="text-md text-gray-700">
              Invited you to{" "}
              <span className="font-medium text-purple-800">
                {request.teamName}
              </span>
            </p>
            <p className="text-sm text-gray-500">"{request.message}"</p>
            <p className="text-xs text-gray-500">
              <strong>Expected Languages: </strong>
              {request.languages}"
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            loading={loading}
            onClick={() => handleResponse(true)}
            className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-sm px-4 py-1.5 rounded-xl hover:brightness-110 transition"
          >
            Accept
          </Button>
          <Button
            loading={loading}
            onClick={() => handleResponse(false)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm px-4 py-1.5 rounded-xl hover:brightness-110 transition"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};
