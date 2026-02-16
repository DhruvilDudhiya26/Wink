import * as ImagePicker from "expo-image-picker"
import { useRouter } from 'expo-router'
import { PenIcon, SignOut } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/Avatar'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { colors, radius, spacingX, spacingY } from '../../constants/theme'
import { useAuth } from '../../contexts/authContext'
import { uploadToCloudinary } from "../../services/imageService"
import { updateProfile } from '../../socket/socketEvents'
import { verticalScale } from '../../utils/styling'

const ProfileModel = () => {
    const { user, logout, updateToken } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Initialize state with user data
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        avatar: ""
    });

    // Update userData when user changes
    useEffect(() => {
        if (user) {
            setUserData({
                name: user?.name || "",
                email: user?.email || "",
                avatar: user?.avatar || ""
            });
        }
    }, [user]);

    useEffect(() => {
        updateProfile(processUpdateProfile);

        return () => {
            updateProfile(processUpdateProfile, true);
        }

    }, []);
    const processUpdateProfile = (res) => {
        setIsLoading(false);
        if (res.success) {
            updateToken(res.token);
            router.back();
        }
    }

    const handleEdit = () => {
        if (user) {
            setUserData({
                name: user?.name || "",
                email: user?.email || "",
                avatar: user?.avatar || ""
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setUserData({
                name: user?.name || "",
                email: user?.email || "",
                avatar: user?.avatar || ""
            });
        }
        setIsEditing(false);
    };
    const handleSave = async () => {
        // Validate inputs
        if (!userData.name.trim()) {
            Alert.alert("Error", "Email cannot be empty");
            return;
        }
        let data = {
            name: userData.name,
            avatar: userData.avatar
        }

        if (typeof userData.avatar == "object") {
            setIsLoading(true);
            const res = await uploadToCloudinary(userData.avatar, "Profiles");
            if (res.success) {
                data.avatar = res.data;
            } else {
                Alert.alert("user", res.msg)
                setIsLoading(false);
                return;
            }
        }
        updateProfile(data);
    };

    const handleAvatarEdit = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setUserData({
                ...userData, avatar: result.assets[0]
            })
        }
    };


    return (
        <ScreenWrapper isModel={true}>
            <View style={styles.container}>
                <Header
                    title="Profile"
                    leftIcon={Platform.OS == "android" && <BackButton color={colors.black} />}
                    style={{ marginVertical: spacingY._15 }}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Section */}
                    <View style={styles.avatarContainer}>
                        <Avatar uri={userData.avatar} size={170} />
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={handleAvatarEdit}
                        >
                            <PenIcon size={verticalScale(20)} color={colors.white} weight="fill" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Fields */}
                    <View style={styles.formContainer}>
                        {/* Name Field */}
                        <View style={styles.fieldContainer}>
                            <Typo style={styles.label}>Name</Typo>
                            {isEditing ? (
                                <Input
                                    value={userData.name}
                                    onChangeText={(text) => setUserData({ ...userData, name: text })}
                                    placeholder="Enter your name"
                                    containerStyle={styles.inputContainer}
                                />
                            ) : (
                                <View style={styles.readOnlyField}>
                                    <Typo style={styles.readOnlyText}>{userData.name || "Not set"}</Typo>
                                </View>
                            )}
                        </View>

                        {/* Email Field */}
                        <View style={styles.fieldContainer}>
                            <Typo style={styles.label}>Email</Typo>
                            {isEditing ? (
                                <Input
                                    value={userData.email}
                                    editable={false}
                                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                                    placeholder="Enter your email"
                                    containerStyle={styles.inputContainer}
                                />
                            ) : (
                                <View style={styles.readOnlyField}>
                                    <Typo style={styles.readOnlyText}>{userData.email || "Not set"}</Typo>
                                </View>
                            )}
                        </View>

                        {/* Action Buttons */}
                        {isEditing ? (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={handleCancel}
                                    disabled={isLoading}
                                >

                                    <Typo color={colors.white} fontWeight="600" style={styles.buttonText}>
                                        Cancel
                                    </Typo>
                                </TouchableOpacity>
                                <Button
                                    style={[styles.actionButton, styles.saveButton]}
                                    onPress={handleSave}
                                    loading={isLoading}
                                >
                                    <View style={styles.buttonContent}>

                                        <Typo color={colors.white} fontWeight="600" style={styles.buttonText}>
                                            Save
                                        </Typo>
                                    </View>
                                </Button>
                            </View>
                        ) : (
                            <Button
                                style={styles.editButton}
                                onPress={handleEdit}
                            >
                                <View style={styles.buttonContent}>
                                    <PenIcon size={verticalScale(20)} color={colors.white} weight="fill" />
                                    <Typo color={colors.white} fontWeight="600" style={styles.buttonText}>
                                        Edit Profile
                                    </Typo>
                                </View>
                            </Button>
                        )}
                    </View>
                </ScrollView>

                {/* Footer with Logout Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            Alert.alert(
                                "Logout",
                                "Are you sure you want to logout?",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Logout",
                                        style: "destructive",
                                        onPress: logout
                                    }
                                ]
                            );
                        }}
                    >
                        <SignOut size={verticalScale(20)} color={colors.rose} />
                        <Typo color={colors.rose} fontWeight="600" style={styles.logoutText}>
                            Logout
                        </Typo>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default ProfileModel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    scrollContent: {
        paddingBottom: spacingY._30,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
        marginTop: spacingY._20,
        marginBottom: spacingY._30,
    },
    editAvatarButton: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._5,
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: spacingY._10,
        borderWidth: 3,
        borderColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    formContainer: {
        gap: spacingY._25,
    },
    fieldContainer: {
        gap: spacingY._10,
    },
    label: {
        paddingLeft: spacingX._15,
        marginBottom: spacingY._5,
        fontWeight: "600",
    },
    inputContainer: {
        borderColor: colors.neutral200,
        paddingLeft: spacingX._20,
        backgroundColor: colors.neutral50, // Much lighter/cleaner
        borderWidth: 1
    },
    readOnlyField: {
        height: verticalScale(56),
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        backgroundColor: colors.neutral50,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.neutral200,
    },
    readOnlyText: {
        color: colors.text,
        fontSize: verticalScale(14),
    },
    buttonContainer: {
        flexDirection: "row",
        gap: spacingX._15,
        marginTop: spacingY._10,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacingX._10,
        height: verticalScale(56),
        borderRadius: radius.full,
    },
    cancelButton: {
        backgroundColor: colors.rose,
    },
    saveButton: {
        backgroundColor: colors.green,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacingX._10,
        marginTop: spacingY._10,
    },
    buttonText: {
        fontSize: verticalScale(16),
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacingX._10,
    },
    footer: {
        borderTopColor: colors.neutral200,
        borderTopWidth: 1,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._20,
        marginTop: spacingY._20,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._12,
    },
    logoutText: {
        fontSize: verticalScale(16),
    },
})