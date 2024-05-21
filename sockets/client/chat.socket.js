const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary.helper");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const userFullName = res.locals.user.fullName;

    _io.once("connection", (socket) => {
        console.log("Có 1 user kết nối");

        _io.emit("ALERT_CONNECT", userFullName);

        // CLIENT_SEND_MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = [];

            if (data.images.length > 0) {
                for (const image of data.images) {
                    const linkImage = await uploadToCloudinary(image);
                    images.push(linkImage);
                }
            }

            // Lưu tin nhắn vào database
            const chat = new Chat({
                user_id: userId,
                // room_chat_id: String,
                content: data.content,
                images: images,
            });

            await chat.save();

            // Trả data realtime về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id: userId,
                content: data.content,
                images: images,
                fullName: userFullName,
            });
        });

        // SERVER_RETURN_TYPING
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: userFullName,
                type: type,
            });
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
            _io.emit("ALERT_DISCONNECT", userFullName);
        });
        // End CLIENT_SEND_MESSAGE
    });
};
