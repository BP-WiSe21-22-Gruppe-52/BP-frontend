import { useAppSelector } from "@redux/hooks";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { Col, message, Row } from "antd";
import React from "react";
import { IncomingRequestCard, OutgoingRequestCard } from "./requestCard";

interface Props {
  reloadFriends: VoidFunction;
}

const Requests: React.FC<Props> = ({ reloadFriends }) => {
  const requests = useAppSelector((state) => state.friends.friendRequests);
  const sentRequests = useAppSelector((state) => state.friends.sentRequests);
  const api = useApi();

  const acceptFriend = (id: number) => {
    api
      .execute(Routes.acceptFriendRequest({ friendId: id }))
      .then((response) => {
        if (!response) return;
        if (!response.success) {
          message.error(response.description);
          return;
        }
        reloadFriends();
      });
  };

  const declineFriend = (id: number) => {
    api
      .execute(Routes.declineFriendRequest({ friendId: id }))
      .then((response) => {
        if (!response) return;
        if (!response.success) {
          message.error(response.description);
          return;
        }
        message.success(response.description);
      });
  };

  const removeFriend = (id: number) => {
    api.execute(Routes.removeFriend({ friendId: id })).then((response) => {
      if (!response) return;
      if (!response.success) {
        message.error(response.description);
        return;
      }
      message.success(response.description);
    });
  };

  return (
    <>
      <Col style={{ width: "250px", margin: "0 25px" }}>
        <Row justify="center">Incoming Requests</Row>
        {requests.length === 0 && <Row justify="center">No requests</Row>}
        {requests.map((request) => (
          <Row key={request.username} justify="center">
            <IncomingRequestCard
              username={request.username}
              onAccept={() => {
                if (!request.id) return;
                acceptFriend(request.id);
                reloadFriends();
              }}
              onDecline={() => {
                if (!request.id) return;
                declineFriend(request.id);
                reloadFriends();
              }}
            />
          </Row>
        ))}
      </Col>
      <Col style={{ width: "250px", margin: "0 25px" }}>
        <Row justify="center">Outgoing Requests</Row>
        {!sentRequests ||
          (sentRequests.length === 0 && (
            <Row justify="center">No requests</Row>
          ))}
        {sentRequests &&
          sentRequests.map((request) => (
            <Row key={request.username} justify="center">
              <OutgoingRequestCard
                username={request.username}
                onCancel={() => {
                  if (!request.id) return;
                  removeFriend(request.id);
                  reloadFriends();
                }}
              />
            </Row>
          ))}
      </Col>
    </>
  );
};

export default Requests;
