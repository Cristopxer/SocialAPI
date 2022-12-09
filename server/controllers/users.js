import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { password, ...otherDetails } = user._doc;
    res.status(200).json({ ...otherDetails });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );
    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    return res.status(200).json(formatedFriends);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, frinedId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(frinedId);
    if (user.friends.includes(frinedId)) {
      user.friends = user.friends.filter((id) => id !== frinedId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends = user.friends.push(frinedId);
      friend.friends = friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );
    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    return res.status(200).json(formatedFriends);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
