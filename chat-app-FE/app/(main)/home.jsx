import { useRouter } from 'expo-router';
import { GearIcon, PlusIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import ConversationItems from '../../components/ConversationItems';
import Loading from '../../components/Loading';
import ScreenWrapper from '../../components/ScreenWrapper';
import Typo from '../../components/Typo';
import { colors, radius, spacingX, spacingY } from '../../constants/theme';
import { useAuth } from '../../contexts/authContext';
import { getConversations, newConversation } from '../../socket/socketEvents';
import { verticalScale } from '../../utils/styling';
import { sendLocalNotification } from '../../services/notificationService';

const Home = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        getConversations(processConversations);
        newConversation(newConversationHandler)

        getConversations(null)
        return () => {
            getConversations(processConversations, true)
            newConversation(newConversationHandler, true)
        }
    }, [])
    const processConversations = (res) => {
        // console.log("res", res)
        if (res.success) {
            setConversations(res.data)
        }
    }

    const newConversationHandler = (res) => {
        if (res.success && res.data?.isNew) {
            setConversations((prev) => [...prev, res.data])
        }
    }

    const handleAskAI = () => {
        // 1. Check if we already have a conversation with guru@ai.bot
        const botConv = conversations.find(c =>
            c.type === 'direct' &&
            c.participants.some(p => p.email === 'guru@ai.bot')
        );

        if (botConv) {
            router.push({
                pathname: "/(main)/conversation",
                params: {
                    id: botConv._id,
                    name: "Guru AI",
                    participants: JSON.stringify(botConv.participants),
                    type: "direct"
                }
            });
        } else {
            router.push({ pathname: "/(main)/newConversationModel", params: { isGroup: 0 } });
        }
    }

    let directConversation = conversations.filter((item) => item.type === "direct").sort((a, b) => {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    let groupConversation = conversations.filter((item) => item.type === "group").sort((a, b) => {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })

    return (
        <ScreenWrapper showPattern={true}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Typo color={colors.neutral400} size={19} textProps={{ numberOfLines: 1 }}>Welcome back,</Typo>
                        <Typo fontWeight='700' color={colors.text} size={22}>{user?.name}</Typo>
                    </View>
                    <TouchableOpacity style={styles.settingIcon} onPress={() => router.push("/(main)/profileModel")}>
                        <GearIcon color={colors.text} weight='fill' size={verticalScale(22)} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: spacingY._20 }} >
                        <View style={styles.navBar}>
                            <View style={styles.tabs}>
                                <TouchableOpacity onPress={() => setSelectedTab(0)} style={[styles.tabStyle, selectedTab == 0 && styles.activeTab]}>
                                    <Typo>Direct Messages</Typo>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab(1)} style={[styles.tabStyle, selectedTab == 1 && styles.activeTab]}>
                                    <Typo>Groups</Typo>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{}}>
                            {
                                selectedTab == 0 && (
                                    directConversation.map((item, index) => {
                                        return (
                                            <ConversationItems item={item} key={index}
                                                router={router}
                                                showDivider={directConversation.length != index + 1}
                                            />
                                        )
                                    })

                                )

                            }
                            {
                                selectedTab == 1 && (
                                    groupConversation.map((item, index) => {
                                        return (
                                            <ConversationItems item={item} key={index}
                                                router={router}
                                                showDivider={groupConversation.length != index + 1}
                                            />
                                        )
                                    })
                                )
                            }
                        </View>
                        {
                            loading && <Loading />
                        }

                    </ScrollView>

                </View>

            </View>
            <Button style={styles.floatingButton} onPress={() => router.push({ pathname: "/(main)/newConversationModel", params: { isGroup: selectedTab } })}>
                <PlusIcon color={colors.white} weight='bold' size={verticalScale(22)} />
            </Button>
            <Button style={[styles.floatingButton, { bottom: verticalScale(90), backgroundColor: colors.primaryDark }]} onPress={handleAskAI}>
                <Typo color={colors.white} fontWeight='600' size={12}>AI</Typo>
            </Button>
            {/* <Button style={{ position: 'absolute', bottom: 100, right: 30, height: 50, width: 50, borderRadius: 25, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }} onPress={() => sendLocalNotification()}>
                <Typo color={colors.white}>Test</Typo>
            </Button> */}
        </ScreenWrapper >
    )
}
export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._15,
    },
    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral100, // Lighter background for icon
        borderRadius: radius.full,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._20,

    },
    navBar: {
        flexDirection: "row",
        gap: spacingX._15,
        alignItems: "center",
        paddingHorizontal: spacingX._10,
    },
    tabs: {
        flexDirection: "row",
        gap: spacingX._10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabStyle: {
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._20,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100,
    },
    activeTab: {
        backgroundColor: colors.primaryLight
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: "absolute",
        bottom: verticalScale(30),
        right: verticalScale(30)
    }

})

