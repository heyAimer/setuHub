import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Toast from "react-native-toast-message";
import { useComments } from "../hooks/useComments";
import useCreateInfo from "../hooks/useCreateInfo";

const convertUTCtoIST = (utcDate) => {
    const date = new Date(utcDate);

    const formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
    return formatter.format(date);
};
const CommentItem = ({ item, onDelete, isOwner }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const owner = item.uuid === isOwner;
    return (
        <View style={styles.commentRow}>
          
            {item.profilePhotoUrl ?
                
                (<Image
                    source={item.profilePhotoUrl}
                    style={styles.pfp}
                />) : (
                    <View style={styles.pfpWrapper}>
                        <LottieView
                            source={require('../../assets/images/profilePic1.json')}
                            autoPlay
                            loop
                            style={{ width: '100%', height: '100%' }}
                        />   
                    </View>
                )
            }
            <View style={{ flex: 1 }}>
                
                <View style={styles.commentHeader}>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center', gap:10}}>
                            <Text style={styles.commentUser}>{item.uuid}</Text>
                            <Text style={styles.commentTime}>
                                {item.createdAt ? convertUTCtoIST(item.createdAt) : ""}
                            </Text>
                        </View>
                        <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                   
                    {owner && <View style={{ alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={() => {
                            setCommentToDelete(item.commentUuid);
                            setDeleteModalVisible(true);
                        }}>
                        <MaterialIcons
                            name="delete-outline"
                            size={20} color="#DA0506"
                        />
                        </TouchableOpacity>
                    </View>}

                    <Modal
                        visible={deleteModalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setDeleteModalVisible(false)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: 300,
                                backgroundColor: 'white',
                                borderRadius: 12,
                                paddingHorizontal: 24,
                                paddingVertical:18,
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
                                    Are you sure you want to delete this comment?
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <TouchableOpacity
                                        onPress={() => setDeleteModalVisible(false)}
                                        style={{ flex: 1, marginRight: 10, padding: 10, borderColor: "#1976D2", borderWidth:2, borderRadius: 8, alignItems: 'center' }}
                                    >
                                        <Text style={{color: "#1976D2"}}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onDelete(commentToDelete);
                                            setDeleteModalVisible(false);
                                        }}
                                        style={{ flex: 1, marginLeft: 10, padding: 10, backgroundColor: '#DA0506', borderRadius: 8, alignItems: 'center' }}
                                    >
                                        <Text style={{ color: 'white' }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
            </View>
        </View>
  );
};

export const CommentSheet = ({ visible, post, onClose,refetchPosts }) => {
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const translateY = useSharedValue(400); // start off screen (bottom)
    const [mounted, setMounted] = useState(visible);

    const {
        comments,
        loading,
        fetchComments,
        createComments,
        deleteComments
    } = useComments();

    const inputRef = useRef(null);
    
    const { user } = useCreateInfo();
    const isOwner = user.uuid;
    
    useEffect(() => {
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
        });

        return () => hideSub.remove();
    }, []);

    useEffect(() => {
        if (visible) {
            setMounted(true)
        }else {
            // delay unmount until *after* animation (400ms)
            const timer = setTimeout(() => setMounted(false), 450);
            return () => clearTimeout(timer);
        };
    }, [visible]);
    
    useEffect(() => {

        if (!visible) {
            translateY.value = withTiming(400, { duration: 180 });
            return;
        }

        translateY.value = withSpring(0, {
            damping: 30,
            stiffness: 150,
            mass: 1,
            overshootClamping: true,
        });
        
        if (post?.postUuid) {
            fetchComments(post.postUuid);
        }
    }, [visible]);

    
    const handleClose = () => {
        setInput("");
        Keyboard.dismiss();
        onClose && onClose();
    }

    const handleSend = async () => {
        const content = input.trim();
        if (!content) return;
       
        setSending(true);
        const newComment = await createComments(post.postUuid, content);

        if (newComment) {
            refetchPosts?.();
            fetchComments(post.postUuid);
        }
        setSending(false);
        setInput("");
    };
    
    const handleDelete = async (commentUuid) => {
        try {
            await deleteComments(commentUuid);
            refetchPosts?.();
            
        } catch (err) {
            Toast.show({ type: "error", text1: "Could not delete comment" });
        }
    };

    const ListEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments yet — be the first to comment!</Text>
        </View>
    );

    const sheetAnim = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));
    
    if (!mounted) return null;  

    return (
        <Animated.View
            pointerEvents="box-none"
            style={[styles.sheetContainer, sheetAnim]}
            >
            <View style={styles.sheetBackground} pointerEvents="auto">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
                            <Text style={styles.title}>Comments ({comments?.length})</Text>

                            <TouchableOpacity
                                onPress={handleClose}
                                style={{ position: 'absolute', right: 0, top: 0, paddingHorizontal:10, paddingVertical:2, borderRadius:4 ,}}
                            >
                                <Text style={{ fontWeight: 'bold', color: 'red' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.inputRow}>
                        {user.profilePhotoUrl ? (<Image
                            source={user.profilePhotoUrl}
                            style={styles.pfp}
                        />) : (
                                <View style={styles.pfpWrapper}>
                                    <LottieView
                                        source={require('../../assets/images/profilePic1.json')}
                                        autoPlay
                                        loop
                                        style={{ width: '100%', height: '100%' }}
                                    />   
                                </View>
                            )
                        }  
                        <Pressable onPress={() => inputRef.current?.focus()} style={{ flex: 1 }}>
                            <TextInput
                                ref={inputRef}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Add a comment..."
                                returnKeyType="done"
                                style={[styles.inputField, { fontFamily: undefined, color: '#000' }]}
                                placeholderTextColor="#828181"
                                editable={!sending}
                            />
                        </Pressable>
                        <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={sending}>
                            {sending ? (
                            <ActivityIndicator size="small" />
                            ) : (
                            <Ionicons name="send" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listWrap}>
                        {
                            loading ? (
                                <ActivityIndicator size="small"/>
                            ) : comments.length === 0 ? (
                                <ListEmpty/>
                            ) : (
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollingEnabled={true} // Android fix
                                        contentContainerStyle={{
                                        paddingBottom: 40, // space at bottom
                                        }}
                                    >
                                        {comments.map((item) => (
                                            <CommentItem
                                                key={item.commentUuid || Math.random().toString()}
                                                item={item}
                                                onDelete={handleDelete}
                                                isOwner={isOwner}
                                            />
                                        ))}
                                    </ScrollView>
                            )
                    }
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
        
    },
    handleIndicator: {
        backgroundColor: "#d0d0d0"
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 10,
    },
    sheetContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },
    sheetBackground: {
        backgroundColor: "#F8FAFC",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderColor: "#E9E9E9",
        borderWidth: 1,
        height: 400,
        overflow: 'hidden',
    },
    sheetContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    header: {
        alignItems: "center", paddingTop: 10, paddingBottom: 12
    },
    handle: {
        width: 40, height: 4, backgroundColor: "#ddd", borderRadius: 8
    },
    title: {
        fontSize: 16, fontWeight: "700"
    },

  inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
        paddingHorizontal: 20
    },
    myAvatar: {
        width: 36, height: 36, borderRadius: 18, marginRight: 10
    },
    inputField: {
        color: 'black',
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 8,
        marginLeft: 8,
        paddingHorizontal: 12,
    },
    sendBtn: {
        marginLeft: 8,
        backgroundColor: "#1976D2",
        paddingVertical: 10,
        paddingHorizontal:12,
        borderRadius: '100%',
        alignItems: "center",
        justifyContent: "center",
    },

    listWrap: {
       flex: 1, marginTop: 2, paddingHorizontal:20
    },
    loadingWrap: {
        flex: 1, padding: 20, alignItems: "center"
    },

    emptyContainer: {
        alignItems: "center", padding: 24
    },
    emptyText: {
        color: "#666"
    },

    commentRow: {
        flexDirection: "row", gap: 12, marginBottom: 14, alignItems: "flex-start"
    },
    commentAvatar: {
        width: 40, height: 40, borderRadius: 20
    },
    commentHeader: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center"
    },
    commentUser: {
        fontWeight: "700"
    },
    commentTime: {
        fontSize: 12, color: "#999"
    },
    commentText: {
        marginTop: 4, lineHeight: 18,  width:280
    },
    commentActions: {
        marginTop: 6, flexDirection: "row"
    },
    deleteText: {
        color: "red", fontSize: 13
    },
     pfp: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E3EFFF'
    },
    pfpWrapper: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden', // IMPORTANT
        borderWidth: 1,
        borderColor: '#E3EFFF',
    },
});
