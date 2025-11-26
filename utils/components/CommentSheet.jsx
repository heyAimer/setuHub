import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useComments } from "../hooks/useComments";

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
  
const CommentItem = ({ item, onDelete }) => {
    // item shape assumed to include: commentuuid, userName, content, createdAt
    console.log("comment item hai: ", item);
  return (
    <View style={styles.commentRow}>
        {item.profilePhotoUrl?
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
        )}
      <View style={{ flex: 1 }}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.uuid || "User"}</Text>
          <Text style={styles.commentTime}>
            {item.createdAt ? convertUTCtoIST(item.createdAt) : ""}
          </Text>
        </View>

        <Text style={styles.commentText}>{item.content}</Text>

        <View style={styles.commentActions}>
          {/* Add like/reply buttons here later */}
          <TouchableOpacity onPress={() => onDelete(item.commentUuid)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const CommentSheet = ({ visible, post, onClose }) => {
    console.log("i am in the comment sheet!");
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    
    const {
        comments,
        loading,
        fetchComments,
        createComments,
        deleteComments
    } = useComments();

    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["55%", "90%"], []);
    const inputRef = useRef(null);

    useEffect(() => {
        if (visible && post?.postUuid) {
            fetchComments(post.postUuid);
        }
    }, [visible, post]);
    
    useEffect(() => {
        console.log("UI RECEIVED COMMENTS: ", comments);
    }, [comments]);
    
    const handleClose = () => {
        setInput("");
        Keyboard.dismiss();
        onClose && onClose();
    }

    const handleSend = async () => {
        const content = input.trim();
        if (!content) return;
        try {
            setSending(true);
            await createComments(post.postUuid, content);
            setInput("");
            // optional: scroll list to top - FlatList will show newest at top by default because we added at index 0
        } catch (error) {
            console.error("Send comment failed ", error);
            Toast.show({type:'error', text1:"Cannot send comment."})
        } finally {
            setSending(false);
        }
    };
    
    const handleDelete = async (commentuuid) => {
        try {
            await deleteComments(commentuuid);
        } catch (err) {
            Toast.show({ type: "error", text1: "Could not delete comment" });
        }
    };
    
    const keyExtractor = (item) => item.commentUuid?.toString() ?? Math.random().toString();

    const renderItem = ({ item }) => <CommentItem item={item} onDelete={handleDelete} />;

    const ListEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments yet — be the first to comment!</Text>
        </View>
    );

    if (!visible) return null;

    console.log("COMMENTS STATE:", comments);


    return (
        <BottomSheet
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={handleClose}
            handleIndicatorStyle={styles.handleIndicator}
            backgroundStyle={styles.sheetBackground}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>Comments ({comments?.length || 0})</Text>
                </View>

                 {/* Input Row */}
                    <View style={styles.inputRow}>
                    <Image
                        source={post.profilePhotoUrl}
                        style={styles.pfp}
                    />
                    <TextInput
                        ref={inputRef}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Add a comment..."
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                        style={styles.input}
                        editable={!sending}
                        multiline={false}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={sending}>
                        {sending ? (
                        <ActivityIndicator size="small" />
                        ) : (
                        <Ionicons name="send" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>

                 {/* Comments List */}
                <View style={styles.listWrap}>
                {loading ? (
                    <View style={styles.loadingWrap}>
                    <ActivityIndicator size="small" />
                    </View>
                ) : (
                    <FlatList
                    data={comments}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ListEmptyComponent={<ListEmpty />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    />
                )}
                </View>
            </KeyboardAvoidingView>
        </BottomSheet>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 16
    },
    handleIndicator: {
        backgroundColor: "#d0d0d0"
    },
    sheetBackground: {
        backgroundColor: "#fff"
    },
    header: {
        alignItems: "center", paddingTop: 8, paddingBottom: 12
    },
    handle: {
        width: 40, height: 4, backgroundColor: "#ddd", borderRadius: 8
    },
    title: {
        marginTop: 8, fontSize: 16, fontWeight: "700"
    },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 12,
  },
    myAvatar: {
        width: 36, height: 36, borderRadius: 18, marginRight: 10
    },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

    listWrap: {
        flex: 1, marginTop: 2, paddingBottom: 20
    },
    loadingWrap: {
        padding: 24, alignItems: "center"
    },

    emptyContainer: {
        alignItems: "center", padding: 24
    },
    emptyText: {
        color: "#666"
    },

    commentRow: {
        flexDirection: "row", gap: 12, marginBottom: 14, alignItems: "flex-start",
        backgroundColor:'red'
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
        fontSize: 12, color: "#999", marginLeft: 8
    },
    commentText: {
        marginTop: 4, lineHeight: 18
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
