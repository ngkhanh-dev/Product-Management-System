// SEND REQUEST FEATURE
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userIdB = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userIdB);
        });
    });
}
// END SEND REQUEST FEATURE

// CANCEL QUEST FEATURE
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userIdB = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
        });
    });
}
// END CANCEL QUEST FEATURE

// REFUSE FRIEND FEATURE
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userIdB = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
        });
    });
}
// END REFUSE FRIEND FEATURE

// ACCEPTED FRIEND FEATURE
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");

            const userIdB = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
        });
    });
}
// END ACCEPTED FRIEND FEATURE

// SERVER RETURN LENGTH
const boxUserBlock = document.querySelector(".box-user");
if (boxUserBlock) {
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        const badgeUsersAccept = document.querySelector(
            `[badge-users-accept="${data.userId}"]`
        );
        if (badgeUsersAccept) {
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    });
}
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND
