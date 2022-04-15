import React from "react";

function UserListItem({ user, handleFunction }) {
  console.log(user)
  return (
    <div className="UserList " onClick={handleFunction}>
      <div className="profile_pic">
        <img src={user.profile_pic} alt="profile_pic" />
      </div>
      <div className="user-info">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default UserListItem;
