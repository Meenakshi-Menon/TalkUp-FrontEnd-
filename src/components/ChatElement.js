import { faker } from "@faker-js/faker";
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import {useTheme, styled} from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { useDispatch } from "react-redux";
import { SelectConversation } from "../redux/slices/app";


const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    return (
        <Box
        onClick={() => {
            dispatch(SelectConversation({room_id: id}));
        }}
            sx={{
                width: "100%",
                height: "70px", // Increased height for more space
                borderRadius: 2,
                backgroundColor: theme.palette.mode === "light" ? "#fff" : theme.palette.background.default,
                display: "flex",
                alignItems: "center",
                padding: "0 20px", // Increased padding
                gap: "12px", // Added gap between avatar and text
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Slight shadow for better separation
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                {online ? <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar src={faker.image.avatar()} />
                </StyledBadge> : <Avatar src={faker.image.avatar()} />}


                <Stack spacing={0.75}>
                    <Typography variant="subtitle2">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {msg}
                    </Typography>
                </Stack>
            </Stack>

            <Stack
                direction="column"
                alignItems="flex-end"
                justifyContent="center"
                sx={{
                    minWidth: "75px",
                    paddingRight: "16px",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        marginBottom: "16px",  // Significantly increased for more spacing
                        lineHeight: "1.2",
                        position: "relative",
                        right: "-18px",
                        top: "-6px",    // Moved much higher
                    }}
                    variant="caption"
                >
                    {time}
                </Typography>

                <Badge
                    color="primary"
                    badgeContent={unread}
                    sx={{
                        '.MuiBadge-badge': {
                            right: -10,
                            top: -2,    // Slightly moved up
                            padding: "4px",
                            fontSize: "0.75rem",
                        },
                    }}
                />
            </Stack>

        </Box>
    );
};


export default ChatElement;
