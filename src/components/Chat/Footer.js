import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
  { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
  { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
  { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
  { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

const ChatInput = ({ openPicker, setOpenPicker, setValue, value, inputRef, onActionClick }) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack sx={{ position: "relative", display: openActions ? "inline-block" : "none" }}>
              {Actions.map((el, i) => (
                <Tooltip key={i} title={el.title} placement="right">
                  <Fab
                    size="small"
                    onClick={() => {
                      setOpenActions(false);
                      onActionClick(el.title);
                    }}
                    sx={{ position: "absolute", top: -el.y, backgroundColor: el.color }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton onClick={() => setOpenActions(!openActions)}>
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            <IconButton onClick={() => setOpenPicker(!openPicker)}>
              <Smiley />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// helpers to embed URLs
function linkify(text) {
  return text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);
}
function containsUrl(text) {
  return /(https?:\/\/[^\s]+)/.test(text);
}

const Footer = () => {
  const theme = useTheme();
  const { current_conversation } = useSelector(state => state.conversation.direct_chat);
  const { sideBar, room_id } = useSelector(state => state.app);
  const user_id = window.localStorage.getItem("user_id");
  const isMobile = useResponsive("between", "md", "xs", "sm");

  const [value, setValue] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const inputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newVal = value.substring(0, start) + emoji.native + value.substring(end);
      setValue(newVal);
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.native.length;
      }, 0);
    }
  };

  const handleActionClick = (title) => {
    console.log("Action clicked:", title);
    // TODO: Add file/photo upload logic based on title
  };

  const handleSend = () => {
    if (!value.trim() || !current_conversation) return;
    socket.emit("text_message", {
      message: linkify(value.trim()),
      conversation_id: room_id,
      from: user_id,
      to: current_conversation.user_id,
      type: containsUrl(value) ? "Link" : "Text",
    });
    setValue("");
  };

  return (
    <Box sx={{ position: "relative", backgroundColor: "transparent !important" }}>
      <Box
        p={isMobile ? 1 : 2}
        width="100%"
        sx={{
          backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack direction="row" spacing={isMobile ? 1 : 3} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Box
              style={{
                position: "fixed",
                bottom: 81,
                right: isMobile ? 20 : sideBar.open ? 420 : 100,
                display: openPicker ? "block" : "none",
                zIndex: 1300,
              }}
            >
              <Picker theme={theme.palette.mode} data={data} onEmojiSelect={handleEmojiClick} />
            </Box>
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              onActionClick={handleActionClick}
            />
          </Box>
          <IconButton
            sx={{
              bgcolor: theme.palette.primary.main,
              height: 48,
              width: 48,
              borderRadius: 1.5,
            }}
            onClick={handleSend}
          >
            <PaperPlaneTilt color="#fff" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
