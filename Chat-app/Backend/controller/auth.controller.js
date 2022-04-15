const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

let SECRET_KEY = `75ZM.w]R++gGE&sf5,8gzr526FBu?<Wvp:qXuV$Gm6>"md3q"c`;

exports.registerUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(200).json("error found");
    }

    const { email, password, username, name, surname, profile_pic } = req.body;

    if (!name || !surname || !email || !password || !username) {
      return res.status(200).json("Fill all the details");
    }

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(200).json(`${username} already exist`);
    } else {
      const hashedPass = bcrypt.hashSync(password, 10);

      const newUser = new User({
        name,
        surname,
        username,
        email,
        password: hashedPass,
        profile_pic,
      });
      const user = await newUser.save();

      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(400).json("something went wrong");
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json("error found");
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Fill all the details");
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json("user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Invalid credientials");
    }

    const token = jwt.sign(
      {
        name: user.name,
        surname: user.surname,
        username: user.username,
        response: `Welcome ${user.name} ${user.surname}`,
        profile_pic: user.profile_pic,
        _id: user._id,
      },
      SECRET_KEY
    );

    res.json({
      token,
      name: user.name,
      surname: user.surname,
      username: user.username,
      profile_pic: user.profile_pic,
      _id: user._id,
    });
  } catch (error) {
    return res.status(200).json("something went wrong");
  }
};

exports.allUsers = async (req, res) => {

console.log(req)
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(keyword);
  const users = await User.find(keyword);
  res.send(users);
};
