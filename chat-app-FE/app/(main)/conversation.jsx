import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { useLocalSearchParams } from 'expo-router'
import { DotsThreeOutlineVerticalIcon, PaperPlaneTiltIcon, PlusIcon } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/Avatar'
import BackButton from '../../components/BackButton'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Loading from "../../components/Loading"
import MessageItem from '../../components/MessageItem'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors, radius, spacingX, spacingY } from '../../constants/theme'
import { useAuth } from '../../contexts/authContext'
import { uploadToCloudinary } from "../../services/imageService"
import { getMessages, newMessage, getConversationById, messageSuggestions, typing, stopTyping } from "../../socket/socketEvents"
import { scale, verticalScale } from '../../utils/styling'
const Conversation = () => {
    const [message, setMessage] = useState("")
    const { user: currentUser } = useAuth();
    const { id: conversationId, name, participants: stringifiedParticipants, avatar, type } = useLocalSearchParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [fetchedConversation, setFetchedConversation] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const typingTimeoutRef = React.useRef(null);

    useEffect(() => {
        newMessage(newMessageHandler);
        getMessages(getMessagesHandler);
        messageSuggestions(suggestionsHandler);
        typing(typingHandler);
        stopTyping(stopTypingHandler);

        getMessages({ conversationId })
        if (!name || stringifiedParticipants == undefined) {
            getConversationById({ conversationId });
            getConversationById(getConversationHandler);
        }

        return () => {
            newMessage(newMessageHandler, true);
            getMessages(getMessagesHandler, true)
            if (!name || stringifiedParticipants == undefined) {
                getConversationById(getConversationHandler, true);
            }
            messageSuggestions(suggestionsHandler, true);
            typing(typingHandler, true);
            stopTyping(stopTypingHandler, true);
        }
    }, [])

    const typingHandler = (res) => {
        if (res.conversationId == conversationId && res.user.id !== currentUser?.id) {
            setTypingUsers(prev => {
                if (!prev.find(u => u.id === res.user.id)) {
                    return [...prev, res.user];
                }
                return prev;
            });
        }
    }

    const stopTypingHandler = (res) => {
        if (res.conversationId == conversationId) {
            setTypingUsers(prev => prev.filter(u => u.id !== res.user.id));
        }
    }

    const handleTextChange = (text) => {
        setMessage(text);

        if (!currentUser) return;

        // Emit typing event
        typing({
            conversationId,
            user: { id: currentUser.id, name: currentUser.name }
        });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to emit stopTyping
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping({
                conversationId,
                user: { id: currentUser.id, name: currentUser.name }
            });
        }, 2000);
    };

    const getMessagesHandler = (res) => {
        if (res.success) {
            setMessages(res.data)
        }

    }

    const newMessageHandler = (res) => {
        setLoading(false)
        if (res.success) {
            if (res.data.conversationId == conversationId) {
                setMessages((prev) => [res.data, ...prev])
            }
        }
    }

    const getConversationHandler = (res) => {
        if (res.success) {
            setFetchedConversation(res.data);
        }
    }

    const suggestionsHandler = (res) => {
        console.log("Suggestions received:", res);
        if (res.conversationId == conversationId && res.suggestions) {
            setSuggestions(res.suggestions);
        }
    }

    const onChipPress = (suggestion) => {
        setMessage(suggestion);
        setSuggestions([]); // Clear suggestions after selection
    }



    const participants = stringifiedParticipants ? JSON.parse(stringifiedParticipants) : (fetchedConversation?.participants || []);
    let conversationAvatar = avatar || fetchedConversation?.avatar;
    let isDirect = (type || fetchedConversation?.type) == "direct";
    const
        otherParticipants = isDirect ? participants.find((p) => p._id != currentUser?.id) : null
    if (isDirect && otherParticipants) {
        conversationAvatar = otherParticipants.avatar
    }
    let conversationName = isDirect ? otherParticipants?.name : (name || fetchedConversation?.name);
    const onPickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 0.5
        })
        if (!result.canceled) {
            setSelectedFile(result.assets[0])
        }
    }
    const onSend = async () => {
        if (!message && !selectedFile) return;
        if (!currentUser) return;
        setLoading(true);
        try {
            let attachment = null;
            if (selectedFile) {
                const uploadResult = await uploadToCloudinary(selectedFile, "message-attachment")

                if (uploadResult.success) {
                    attachment = uploadResult.data
                } else {
                    setLoading(false)
                    Alert.alert("Error", "Could not send the image !")
                }
            }
            newMessage({
                conversationId,
                sender: {
                    id: currentUser?.id,
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                },
                content: message.trim(),
                attachment
            });

            setMessage("");
            setSelectedFile(null);
            setSuggestions([]); // Clear suggestions when sending a message
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5} >
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                <Header style={styles.header} leftIcon={<View style={styles.headerLeft}>
                    <BackButton color={colors.text} />
                    <Avatar size={40} uri={conversationAvatar} isGroup={type == "group"} />
                    <Typo color={colors.text} fontWeight={"600"} size={18} textProps={{ numberOfLines: 1 }}>
                        {conversationName}
                    </Typo>
                </View>}
                    rightIcon={<TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
                        <DotsThreeOutlineVerticalIcon weight='fill' color={colors.text} />
                    </TouchableOpacity>}
                />

                {/* header typing indicator */}
                {typingUsers.length > 0 && (
                    <View style={styles.typingIndicator}>
                        <Typo size={12} color={colors.textLight}>
                            {typingUsers.length === 1
                                ? `${typingUsers[0].name} is typing...`
                                : `${typingUsers.length} people are typing...`}
                        </Typo>
                    </View>
                )}

                {/* messages */}
                <View style={styles.content}>
                    <FlatList
                        data={messages}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messagesContent}
                        renderItem={({ item }) => (
                            <MessageItem item={item} isDirect={isDirect} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    <View style={styles.footer} >
                        {/* Suggestion Chips */}
                        {suggestions.length > 0 && (
                            <View style={styles.chipsContainer}>
                                {suggestions.map((suggestion, index) => (
                                    <TouchableOpacity key={index} style={styles.chip} onPress={() => onChipPress(suggestion)}>
                                        <Typo size={12} color={colors.textLight}>{suggestion}</Typo>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                    <Input value={message} onChangeText={handleTextChange} placeholder="Type message" containerStyle={{
                        paddingLeft: spacingX._10,
                        paddingRight: scale(65),
                        borderWidth: 0
                    }}
                        icon={
                            <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                                <PlusIcon color={colors.black} weight='bold' size={verticalScale(22)} />
                                {
                                    selectedFile && selectedFile.uri && (
                                        <Image source={selectedFile.uri} style={styles.selectedFile} />
                                    )
                                }
                            </TouchableOpacity>
                        }
                    />
                    <View style={styles.inputRightIcon}>
                        <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                            {
                                loading ? <Loading size="small" color={colors.white} /> : <PaperPlaneTiltIcon color={colors.white} weight='fill' />
                            }
                        </TouchableOpacity>
                    </View>

                </View>

            </KeyboardAvoidingView>

        </ScreenWrapper >
    )
}
export default Conversation

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15
    },
    typingIndicator: {
        paddingHorizontal: spacingX._15,
        paddingBottom: spacingY._5,
    },
    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._15,
    },
    messagesContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12,
    },
    messagesContainer: {
        flex: 1
    },
    selectedFile: {
        position: "absolute",
        height: verticalScale(38),
        width: verticalScale(38),
        borderRadius: radius.full,
        alignSelf: "center"
    },
    inputRightIcon: {
        position: "absolute",
        right: scale(10),
        top: verticalScale(15),
        paddingLeft: spacingX._12,
        borderLeftWidth: 1.5,
        borderLeftColor: colors.neutral300
    },
    footer: {

    },
    chipsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacingX._15,
        paddingBottom: spacingY._10,
        gap: spacingX._10
    },
    chip: {
        backgroundColor: colors.neutral200, // or a light primary color
        paddingHorizontal: spacingX._12,
        paddingVertical: spacingY._5,
        borderRadius: radius._15,
        borderWidth: 1,
        borderColor: colors.neutral300
    }
})