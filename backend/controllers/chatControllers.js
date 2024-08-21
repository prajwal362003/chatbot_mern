import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.create({
      user: userId,
    });

    res.json(chat);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      createdAt: -1, // new chat is visible first
    });

    res.json(chats);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const addConversation = async (req, res) => {
  try {
    // find chat by id
    const chat = await Chat.findById(req.params.id);

    // if chat is not found
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // if chat is found, create conversation
    const conversation = await Conversation.create({
      chat: chat._id,
      question: req.body.question,
      answer: req.body.answer,
    });

    // update chat by latest conversation
    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, {
      latestMsg: req.body.question,
      new: true,
    });

    res.json({
      conversation,
      updatedChat,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get all the conversations
export const getConversation = async (req, res) => {
  try {
    // find conversation by id
    const conversation = await Conversation.find({ chat: req.params.id });

    if (!conversation) {
      res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete a conversation
export const deleteChat = async (req, res) => {
  try {
    // Find conversation by id
    const chatToBeDeleted = await Chat.findById(req.params.id);

    if (!chatToBeDeleted) {
      res.status(404).json({
        message: "Chat not found",
      });
    }

    // If we are not an author of a chat to be deleted
    if (chatToBeDeleted.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this chat",
      });
    }

    // Else delete the chat
    await chatToBeDeleted.deleteOne();

    res.json({
      message: "Chat deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
