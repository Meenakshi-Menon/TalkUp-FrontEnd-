import { Dialog, DialogContent, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchFriendRequests, FetchFriends, FetchUsers } from '../../redux/slices/app';
import { FriendComponent, FriendRequestComponent, UserComponent } from '../../components/Friends';

const UsersList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchUsers());
    }, []);

    const { users } = useSelector((state) => state.app);

    return (
        <>

            {users.map((el, idx) => {
                //  Render UserComponent
                return <UserComponent key={el._id} {...el} />;
            })}
        </>
    );
};



const FriendsList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchFriends());
    }, []);

    const { friends } = useSelector((state) => state.app);


    {/*console.log("Type of friends:", typeof friends); // should be 'object'
    console.log("Is array:", Array.isArray(friends)); // should be true
    console.log("Friends data:", friends);*/}

    return (
        <>
            {friends.map((el, idx) => {
                // Render Friend Component
                return <FriendComponent key={el._id} {...el} />;
            })}


        </>
    );
};


const FriendRequestList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchFriendRequests());
    }, []);

    const { friendRequests } = useSelector((state) => state.app);

    return (
        <>
            {friendRequests.map((el, idx) => {
                // el => {_id, sender: {_id, firstName, lastName, img, online}}
                // Render FriendRequestComponent
                return <FriendRequestComponent key={el._id} {...el.sender} id={el._id}/>;
            })}
        </>
    );
};





const Friends = ({ open, handleClose }) => {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted onClose={handleClose} sx={{ p: 4 }}>
            <Stack p={2} sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} centered>

                    <Tab label="Explore" />
                    <Tab label="Friends" />
                    <Tab label="Requests" />

                </Tabs>

            </Stack>
            {/* Dialog Content */}
            <DialogContent>
                <Stack sx={{ height: "100%" }}>
                    <Stack spacing={2.5}>
                        {(() => {
                            switch (value) {
                                case 0: // dissplay all users
                                    return <UsersList />;

                                case 1: // display all friends
                                    return <FriendsList />;

                                case 2: // display all friend requests
                                    return <FriendRequestList />;

                                default:
                                    break;
                            }
                        })()}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default Friends;