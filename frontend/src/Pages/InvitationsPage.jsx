import { useEffect, useState } from "react";
import {
  InviteNotification,
  InviteRequest,
} from "../components/Invite.jsx/InviteNotification";
import axios from "axios";
import API from "../utils/API";

const InvitationsPage = () => {
  const [invites, setInvites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/team/user/invitations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setInvites(response.data.pending);
      setNotifications(response.data.history);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const updateInviteStatus = (id, status) => {
    setInvites(invites.filter((invite) => invite._id !== id));
    setNotifications([
      {
        _id: id,
        teamName: invites.find((i) => i._id === id)?.teamName,
        status,
        timestamp: "Just now",
      },
      ...notifications,
    ]);
  };

  if (loading) return <div>Loading invitations...</div>;

  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Your Invitations
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Pending Requests
          </h2>
          {invites.length === 0 ? (
            <p className="text-gray-600">No pending invitations</p>
          ) : (
            invites.map((request) => (
              <InviteRequest
                key={request._id}
                request={request}
                onUpdate={(id, status) => {
                  setInvites(invites.filter((invite) => invite._id !== id));
                  setNotifications([
                    {
                      _id: id,
                      teamName: request.teamName,
                      status,
                      timestamp: "Just now",
                    },
                    ...notifications,
                  ]);
                }}
              />
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Invitation History
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-600">No invitation history</p>
          ) : (
            notifications.map((notification) => (
              <InviteNotification
                key={notification._id}
                notification={notification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationsPage;
