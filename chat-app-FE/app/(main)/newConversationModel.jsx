import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Avatar from '../../components/Avatar';
import BackButton from '../../components/BackButton';
import Button from "../../components/Button";
import Header from '../../components/Header';
import Input from "../../components/Input";
import ScreenWrapper from '../../components/ScreenWrapper';
import Typo from "../../components/Typo";
import { colors, radius, spacingX, spacingY } from '../../constants/theme';
import { useAuth } from "../../contexts/authContext";
import { uploadToCloudinary } from "../../services/imageService";
import { getContacts, newConversation } from "../../socket/socketEvents";
import { verticalScale } from "../../utils/styling";

const newConversationModel = () => {
    const { isGroup } = useLocalSearchParams();
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const [groupAvatar, setGroupAvatar] = useState(null);
    const [groupName, setGroupName] = useState("")
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [contacts, setContacts] = useState([])
    const { user: currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getContacts(processGetContacts);
        newConversation(processNewConversation);
        getContacts(null)

        return () => {
            getContacts(processGetContacts, true)
            newConversation(processNewConversation, true);
        }
    }, [])
    const processNewConversation = (res) => {
        setIsLoading(false)
        if (res.success) {
            router.back();
            router.push({
                pathname: "/(main)/conversation",
                params: {
                    id: res.data._id,
                    name: res.data.name,
                    avatar: res.data.avatar,
                    type: res.data.type,
                    participants: JSON.stringify(res.data.participants)
                }
            })
        } else {
            Alert.alert("Error ", res.msg)
        }
    }
    const processGetContacts = (res) => {
        if (res.success) {
            setContacts(res.contacts)
        }
    }

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setGroupAvatar({
                avatar: result.assets[0]
            })
        }
    };
    const toggleParticipant = (user) => {
        setSelectedParticipants((prev) => {
            if (prev.includes(user._id)) {
                return prev.filter((_id) => _id != user._id)
            }
            return [...prev, user._id]
        })

    }
    const onSelectUser = (user) => {
        if (!currentUser) {
            Alert.alert("Authentication", "Please login to start conversation")
            return;
        }
        if (isGroupMode) {
            toggleParticipant(user)
        } else {
            newConversation({ type: "direct", participants: [currentUser.id, user._id] })
        }
    }
    const createGroup = async () => {
        if (!groupName.trim() || !currentUser || selectedParticipants.length < 2) return;

        setIsLoading(true);
        try {
            let avatar = null;
            if (groupAvatar) {
                const uploadResult = await uploadToCloudinary(groupAvatar.avatar, "group-avatars");
                if (uploadResult.success) {
                    avatar = uploadResult.data
                }
            }
            newConversation({
                type: "group",
                participants: [currentUser.id, ...selectedParticipants],
                name: groupName,
                avatar: avatar
            })

        } catch (error) {
            Alert.alert("error", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScreenWrapper isModel={true}>
            <View style={styles.container}>
                <Header title={isGroupMode ? "New Group" : "Select user"}
                    leftIcon={<BackButton color={colors.black} />}
                />
                {
                    isGroupMode && (
                        <View style={styles.groupInfoContainer}>
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity onPress={handlePickImage}>
                                    <Avatar uri={groupAvatar?.avatar || null} size={100} isGroup={true}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.groupNameContainer}>
                                <Input placeHolder="Group Name" value={groupName} onChangeText={setGroupName} />
                            </View>
                        </View>
                    )
                }
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contactList}>
                    {
                        contacts.map((users, index) => {
                            const isSelected = selectedParticipants.includes(users._id)
                            return (
                                <TouchableOpacity key={index} style={[styles.contactRow, isSelected && styles.selectedContact]} onPress={() => onSelectUser(users)}>
                                    <Avatar uri={users.avatar} size={50} />
                                    <Typo style={styles.name}>{users.name}</Typo>
                                    {
                                        isGroupMode && (
                                            <View style={styles.selectedIndicator}>
                                                <View style={[styles.checkBox, isSelected && styles.checked]}>

                                                </View>

                                            </View>
                                        )
                                    }
                                </TouchableOpacity>
                            )

                        })
                    }

                </ScrollView>
                {
                    isGroupMode && selectedParticipants.length >= 2 && (
                        <View style={styles.createGroupButton}>
                            <Button onPress={createGroup} disabled={!groupName.trim()} loading={isLoading}>
                                <Typo fontWeight={"600"}>Create group</Typo>
                            </Button>


                        </View>
                    )
                }

            </View>
        </ScreenWrapper >

    )
}

export default newConversationModel

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10
    },
    avatarContainer: {
        marginBottom: spacingY._10,
    },
    groupNameContainer: {
        width: "100%"
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
    },
    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(20),
    },
    selectedIndicator: {
        marginLeft: "auto",
        marginRight: spacingX._10,
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        bordercolor: colors.primary
    },
    checked: {
        backgroundColor: colors.primary,
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
    }

})